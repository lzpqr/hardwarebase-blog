---
title: 硬件接口协议之 JESD204B 接口
date: 2026-10-10 10:40:00
categories:
  - 硬件设计
tags:
  - 接口协议
  - JESD204B
  - ADC/DAC
  - 选型参考
description: JESD204B 高速串行 ADC/DAC 接口的设计说明：Subclass A/B/C 编码、Lane 速率与配置、64b/66b 与 8b/10b 选择、PCB 走线阻抗与终端、时钟体系、多芯片同步与可靠性验证。
permalink: posts/hardware-interface-protocol-jesd204b/
cover:
---

## 一、文档目的与适用范围

本文档规定硬件产品中 JESD204B（高速串行 ADC/DAC 接口）的设计要求，覆盖 Subclass A/B/C 编码选择、Lane 速率与通道配置、64b/66b 与 8b/10b 编码策略、PCB 走线阻抗控制、时钟体系、多芯片同步设计、可靠性验证，作为原理图设计、PCB 设计、器件选型与整机联调的通用依据。

适用范围：采用 JESD204B 接口的高速 ADC/DAC 系统、软件无线电、通信基站、雷达信号处理与测试测量设备。JESD204C（多芯片同步增强版）设计不在本文档范围内，JESD209（串行多通道）另文说明。

## 二、接口概述

JESD204B 由 JESD 标准定义，是高速串行 ADC/DAC 数据接口的标准协议，核心特征如下：

- **编码体系**：JESD204B 分三个 Subclass：Subclass A（8b/10b 编码，向后兼容 JESD204A）、Subclass B（64b/66b 编码，与 PCIe 3.0 兼容）、Subclass C（无编码，直接传输）；Subclass B 是主流选择，带宽效率最高。
- **Lane 速率**：JESD204B 支持 1.0~12.5Gbps/lane（Subclass B），每芯片 1~8 lane；ADC 采样率 20MSPS~1GSPS，字宽 12~16 bit 时 lane 数自动计算。
- **64b/66b 编码**：Subclass B 采用 64b/66b 编码（与 PCIe 3.0 一致），带宽开销仅 3.125%；对比 8b/10b（开销 20%），在高速场景下显著降低 SerDes 速率。
- **Lane 偏斜**：多 lane 系统各 lane 偏斜要求 < 5UI（Subclass B，64b/66b），< 50UI（Subclass A，8b/10b）；UI = 1/lane 速率。
- **控制寄存器**：JESD204B 通过 2 线控制总线（SCLK、SDA，类似 I2C）配置 ADC/DAC 内部寄存器；配置完成后链路自动训练。
- **多芯片同步**：JESD204B 支持多 ADC/DAC 芯片通过 SYNC 引脚同步，实现多通道系统时间对齐；同步误差 < 1UI。

## 三、物理层设计

### （一）信号定义

| 信号 | 方向 | 说明 |
| --- | --- | --- |
| TXP / TXN | 发送 | SerDes 差分发送对，100Ω 差分 |
| RXP / RXN | 接收 | SerDes 差分接收对，100Ω 差分 |
| REFCLK_P / REFCLK_N | 参考时钟 | 125~156.25MHz，HCSL，共模 1.2V |
| SCLK / SDA | 控制 | 2 线控制总线，配置寄存器（类似 I2C） |
| SYNC | 同步 | 多芯片同步信号，上升沿对齐 |
| LOS | 链路状态 | 链路丢失指示，高电平 = 链路正常 |

### （二）Lane 速率计算

JESD204B lane 数与速率由 ADC 采样率、字宽与 Subclass 决定：

```text
lane 速率 (Gbps) = ADC 采样率 (MSPS) × 字宽 (bit) × lane 数
                 ÷ 1000
```

| 采样率 | 字宽 | lane 数 | Subclass B lane 速率 |
| --- | --- | --- | --- |
| 100MSPS | 14bit | 1 | 1.4Gbps |
| 200MSPS | 14bit | 2 | 1.4Gbps |
| 500MSPS | 14bit | 4 | 1.75Gbps |
| 1GSPS | 16bit | 4 | 3.2Gbps |

### （三）阻抗控制

JESD204B 信号走线阻抗要求：

- **差分 100Ω**：TXP/TXN 与 RXP/RXN 差分阻抗 100Ω ±10%，TDR 实测；ADC/DAC 芯片走线 < 10cm，SerDes 走线 < 20cm。
- **等长匹配**：Subclass B 各 lane 偏斜 < 5UI（64b/66b），Subclass A < 50UI（8b/10b）；多 lane 系统各 lane 偏斜 < 5ps（1Gbps lane）。
- **终端**：接收端 100Ω 并接终端（差分对两端各 50Ω 至 GND）；发送端不串接（SerDes 驱动器内部已含）。
- **参考时钟**：125~156.25MHz HCSL，共模 1.2V，走线等长匹配 < 5ps，长度 ≤ 10cm；时钟抖动 RMS < 0.5ps。

### （四）控制总线

JESD204B 2 线控制总线（SCLK/SDA）设计：

- **电平**：3.3V CMOS，上拉 10kΩ 至 3.3V；SCLK 频率 ≤ 1MHz（配置阶段），通信速率非关键。
- **多芯片**：多 ADC/DAC 芯片共享同一控制总线，通过 CS 引脚（片选）区分；每芯片 CS 引脚独立。
- **配置时序**：上电后先配置控制寄存器（Subclass、lane 数、字宽、速率）→ 链路自动训练 → 数据通信；配置阶段 LOS 低电平，训练完成后 LOS 高电平。

### （五）多芯片同步

多 ADC/DAC 芯片同步设计要求：

- **SYNC 信号**：由系统时钟源（晶振或时钟芯片）提供，上升沿对齐；SYNC 周期 ≥ 2 个采样周期。
- **同步误差**：多芯片 SYNC 上升沿偏差 < 1UI（Subclass B），保证多通道时间对齐。
- **时钟体系**：所有芯片共享同一 REFCLK，CDR 独立锁定；多芯片 CDR 锁定时间 < 10ms。

## 四、协议层设计

JESD204B 协议层设计要点：

| 层级 | 要点 | 设计要求 |
| --- | --- | --- |
| 物理层 | SerDes lane，64b/66b 或 8b/10b 编码 | 各 lane 独立训练，BER < 10⁻¹² |
| 链路层 | 帧封装 + 校验（CRC 32，Subclass B） | 帧长 8/16/32/64 字节，QoS 优先级 |
| 控制层 | 2 线控制总线，寄存器配置 | Subclass、lane 数、字宽、速率配置 |

Subclass 选择指南：

| Subclass | 编码 | 带宽效率 | 适用场景 |
| --- | --- | --- | --- |
| A（8b/10b） | 8b/10b | 80% | 向后兼容 JESD204A，速率 < 3Gbps/lane |
| B（64b/66b） | 64b/66b | 96.9% | 主流，速率 3~12.5Gbps/lane，多 lane 系统 |
| C（无编码） | 直接传输 | 100% | 特殊场景，速率极低（< 1Gbps/lane） |

## 五、收发操作时序

JESD204B 链路训练时序：

1. **上电复位**：ADC/DAC 全局复位（≥ 100µs）→ SerDes 进入 Reset 状态 → LOS 低电平。
2. **控制寄存器配置**：通过 SCLK/SDA 写入 Subclass、lane 数、字宽、速率 → 配置完成。
3. **链路训练**：SerDes CDR 锁定（< 10ms）→ 64b/66b 同步字交换 → 链路 Active。
4. **LOS 指示**：链路正常时 LOS 高电平；链路丢失时 LOS 低电平，系统报警。
5. **数据通信**：Active 状态下，ADC/DAC 采样数据按 lane 时序传输；多芯片系统 SYNC 对齐。
6. **热插拔**：ADC/DAC 拔出 → CDR 失锁 → LOS 低电平 → 重新插入 → 重新配置与训练（< 10ms）。

## 六、硬件设计要点

- **板框**：JESD204B 板卡尺寸依系统而定，常见 100mm × 160mm（3U）或 100mm × 233.4mm（6U）；ADC/DAC 芯片靠近连接器放置，走线 < 5cm。
- **连接器**：推荐 Molex SlimStack 系列（SerDes 专用）或 Samtec 高速连接器，插损 < 1.5dB @ 8GHz；镀层 30µin 镍 + 5µin 金。
- **ADC/DAC 选型**：TI ADC16DJ5400（1GSPS，14bit，4 lane）、ADI AD9625（500MSPS，16bit，4 lane）、NXP SPH1625A（1GSPS，16bit，8 lane）；根据采样率与字宽选择 lane 数。
- **背板层叠**：12~16 层，SerDes 信号层阻抗 100Ω（差分）；参考时钟独立层，走线长度 ≤ 10cm。
- **散热**：ADC/DAC 芯片功耗 2~5W，热沉 → 板框 → 导风板散热路径；多芯片系统散热路径独立。

## 七、典型应用场景

| 场景 | 配置 | 说明 |
| --- | --- | --- |
| 软件无线电 | 4× AD9625 500MSPS | 多通道同步，SYNC 误差 < 1UI |
| 通信基站 | 2× ADC16DJ5400 1GSPS | 16bit，4 lane，BER < 10⁻¹² |
| 雷达信号处理 | 8× SPH1625A 1GSPS | 多芯片同步，8 lane/芯片 |
| 测试测量 | 4× ADC16DJ5400 500MSPS | 多通道同步，低延迟 |

## 八、可靠性与测试验证

1. **TDR 阻抗测试**：差分 100Ω，TDR 实测偏差 < ±10%；记录背板与板卡各段实测值。
2. **链路训练**：上电后 < 10ms 完成 CDR 锁定与链路训练；各 lane 速率（1.0~12.5Gbps）均满足。
3. **误码率**：JESD204B 链路 BER < 10⁻¹²（CRC 32 错误计数，运行 24h）；各 lane 均满足。
4. **多芯片同步**：SYNC 上升沿偏差 < 1UI（Subclass B），多通道时间对齐；实测同步误差记录。
5. **热插拔**：模拟 5000 次插拔，连接器插损变化 < 0.5dB @ 8GHz；链路训练成功率 100%。
6. **参考时钟抖动**：RMS < 0.5ps（12~20MHz），峰峰值 < 2ps；晶振选型 125~156.25MHz，抖动指标满足。
7. **ESD 测试**：IEC 61000-4-2，接触放电 ±4kV（SerDes 连接器），空气放电 ±8kV；链路无复位、无 CRC 错误。
8. **温度循环**：-40°C~+85°C，100 循环，无连接器插损变化、无背板层间脱焊。

## 九、设计检查清单

1. ADC/DAC 芯片型号已确认（TI/ADI/NXP），采样率与字宽匹配 lane 数与 lane 速率。
2. SerDes 连接器型号已确认（Molex/Samtec），插损 < 1.5dB @ 8GHz，镀层规格匹配。
3. 信号走线阻抗：差分 100Ω，TDR 实测偏差 < ±10%。
4. 多 lane 系统各 lane 偏斜 < 5UI（Subclass B），< 50UI（Subclass A），已标注。
5. 接收端 100Ω 并接终端已放置（差分对两端各 50Ω 至 GND）。
6. 参考时钟 125~156.25MHz HCSL 走线等长匹配 < 5ps，长度 ≤ 10cm，下方完整 GND 铺铜。
7. 控制总线（SCLK/SDA）已预留，上拉 10kΩ 至 3.3V；多芯片 CS 引脚独立。
8. SYNC 信号已预留，多芯片同步误差 < 1UI（Subclass B），实测记录。
9. GND 铺铜完整，SerDes 差分对下方 GND 过孔密度 ≥ 每 5mm 一个。
10. 已完成 TDR、链路训练、BER、多芯片同步、热插拔、ESD 测试，指标满足产品要求。

> 注：本文为 JESD204B 接口的通用设计说明。具体项目的 ADC/DAC 型号、lane 数、Subclass 选择与多芯片同步方案最终以所用器件数据手册为准，关键指标应在样板阶段通过实测确定。
