---
title: 硬件接口协议之 Aurora 接口
date: 2026-10-10 10:30:00
categories:
  - 硬件设计
tags:
  - 接口协议
  - Aurora
  - Xilinx
  - 选型参考
description: Xilinx Aurora 高速串行通信协议的设计说明：协议架构（通道/流/帧）、速率与通道配置、PCB 走线阻抗与终端、时钟与复位、FPGA 实现要点、可靠性验证。
permalink: posts/hardware-interface-protocol-aurora/
cover:
---

## 一、文档目的与适用范围

本文档规定硬件产品中 Xilinx Aurora 高速串行通信协议的设计要求，覆盖协议架构（通道/流/帧）、速率与通道配置、PCB 走线阻抗控制、时钟与复位设计、FPGA 实现要点、可靠性验证，作为原理图设计、PCB 设计、器件选型与整机联调的通用依据。

适用范围：采用 Xilinx FPGA 作为通信核心的板卡系统、嵌入式互连与高性能计算平台。非 Xilinx FPGA 的类似协议（如 Zynq UltraScale+ MPSoC）另文说明。

## 二、接口概述

Aurora 是 Xilinx 定义的轻量级高速串行通信协议，基于 SerDes 物理层，核心特征如下：

- **协议架构**：Aurora 分三层：Channel（通道，对应 SerDes lane）、Stream（流，承载用户数据）、Frame（帧，封装与校验）；每通道可配置 1~8 个流。
- **速率**：Xilinx 7 系列（Artix-7/Kintex-7/Virtex-7）支持 3.125/6.25/12.5Gbps/lane；UltraScale 系列支持 6.25/12.5/25.781/32.0Gbps/lane；每板 4~8 lane 常见。
- **编码**：64b/66b 编码（UltraScale）或 8b/10b（7 系列），BER < 10⁻¹²；CRC 16 校验。
- **通道配置**：x1/x2/x4/x8 配置，通道间偏斜 < 5ps（UltraScale）/ < 50ps（7 系列）；每通道独立训练，支持热插拔。
- **流控制**：每流独立 FIFO（深度 1~256 帧），背压控制（flow control）；支持 QoS 优先级。
- **与 PCIe/SRIO 区别**：Aurora 是用户自定义协议，灵活性高（帧长、流数、QoS 可配置），但无标准路由表，多设备互连需软件寻址。

## 三、物理层设计

### （一）信号定义

| 信号 | 方向 | 说明 |
| --- | --- | --- |
| TXP / TXN | 发送 | SerDes 差分发送对，100Ω 差分 |
| RXP / RXN | 接收 | SerDes 差分接收对，100Ω 差分 |
| REFCLK_P / REFCLK_N | 参考时钟 | 156.25MHz（6.25Gbps）或 312.5MHz（12.5Gbps），HCSL |
| GREFCLK | 全局参考 | FPGA 全局时钟，用于 CDR 锁定 |

### （二）阻抗控制

Aurora 信号走线阻抗要求：

- **差分 100Ω**：TXP/TXN 与 RXP/RXN 差分阻抗 100Ω ±10%，TDR 实测；7 系列走线长度 ≤ 15cm，UltraScale ≤ 20cm。
- **等长匹配**：TX 对与 RX 对偏斜 < 5ps（UltraScale），< 50ps（7 系列）；多 lane 系统各 lane 偏斜 < 5ps。
- **终端**：接收端 100Ω 并接终端（差分对两端各 50Ω 至 GND）；发送端不串接（SerDes 驱动器内部已含）。
- **参考时钟**：156.25MHz HCSL，共模 1.2V（1kΩ 至 1.2V + 1kΩ 至 GND），走线等长匹配 < 5ps，长度 ≤ 10cm。

### （三）时钟体系

Aurora 时钟配置：

- **REFCLK**：外部晶振（156.25MHz / 312.5MHz）→ FPGA 全局时钟输入 → SerDes PLL → 发送时钟；抖动 RMS < 1ps。
- **CDR**：接收端 CDR 从数据流恢复时钟，支持 6.25/12.5/25.781/32.0Gbps 自动锁定；锁定时间 < 5ms。
- **时钟切换**：多速率系统通过软件配置 SerDes PLL，切换时间 < 10ms；切换期间链路训练重新执行。

### （四）PCB 走线规则

- 高速差分对走线下方完整 GND 层，禁止开窗；过孔回折消除（via stub cancellation）。
- 参考时钟走线远离高速差分对，间隔 ≥ 2mm；时钟层与信号层之间加 1mm 空气间隔。
- 多 lane 系统 lane 间等长匹配 < 5ps（UltraScale），蛇形余量在连接器焊盘处预留。

## 四、协议层设计

Aurora 三层协议设计要点：

| 层级 | 要点 | 设计要求 |
| --- | --- | --- |
| 物理层（Channel） | SerDes lane，64b/66b 或 8b/10b 编码 | 每 lane 独立训练，BER < 10⁻¹² |
| 链路层（Stream） | 用户数据流，帧封装 + CRC 16 | 每流独立 FIFO（1~256 帧），背压控制 |
| 传输层（Frame） | 帧长 1~64 字节，QoS 优先级 0~7 | 帧长与 QoS 在系统初始化时配置 |

通道配置示例：

| 配置 | lane 数 | 每 lane 速率 | 总带宽 | 典型应用 |
| --- | --- | --- | --- | --- |
| x4 基本 | 4 | 6.25Gbps | 25Gbps | 嵌入式 DSP 互连 |
| x8 高速 | 8 | 12.5Gbps | 100Gbps | 多板 FPGA 互连 |
| x4 高吞吐 | 4 | 25.781Gbps | 103Gbps | UltraScale 数据交换 |

## 五、收发操作时序

Aurora 链路训练时序：

1. **上电复位**：FPGA 全局复位（50µs）→ SerDes 进入 Reset 状态 → 链路无数据。
2. **链路检测**：检测对端 SerDes 是否在线（PRSNT# 或 SerDes CDR 锁定）→ 进入 Training 状态。
3. **CDR 锁定**：接收端 CDR 从数据流锁定（< 5ms）→ 发送端开始发送 64b/66b 同步字。
4. **链路训练**：双方交换训练序列，确认速率与编码 → 进入 Active 状态。
5. **数据通信**：Active 状态下，Stream 层开始传输用户数据；帧封装 + CRC 16 校验。
6. **热插拔**：对端拔出 → SerDes CDR 失锁 → 链路进入 Idle 状态 → 重新插入 → 重新训练（< 5ms）。

## 六、硬件设计要点

- **板框**：Aurora 板卡尺寸依系统而定，常见 100mm × 160mm（3U）或 100mm × 233.4mm（6U）；SerDes 芯片靠近连接器放置，走线 < 5cm。
- **连接器**：推荐 Molex SlimStack 系列（SerDes 专用）或 Samtec 高速连接器，插损 < 1.5dB @ 16GHz（UltraScale）；镀层 30µin 镍 + 5µin 金。
- **FPGA 选型**：Artix-7（x4 6.25Gbps）适合低成本嵌入式；Kintex-7/Virtex-7（x8 12.5Gbps）适合中等吞吐；UltraScale（x8 25.781/32.0Gbps）适合高吞吐。
- **背板层叠**：12~16 层，SerDes 信号层阻抗 100Ω（差分）；参考时钟独立层，走线长度 ≤ 10cm。
- **散热**：FPGA 功耗 5~15W（UltraScale），热沉 → 板框 → 导风板散热路径；热通量密度 < 50W/cm²。

## 七、典型应用场景

| 场景 | 配置 | 说明 |
| --- | --- | --- |
| 嵌入式 DSP | 4× Kintex-7 x4 6.25Gbps | 星型拓扑，低延迟，BER < 10⁻¹² |
| 多板 FPGA 互连 | 8× Virtex-7 x8 12.5Gbps | 环型拓扑，高吞吐 |
| 高性能计算 | 4× UltraScale x8 25.781Gbps | 树型拓扑，支持 QoS |
| 通信基带 | 2× Artix-7 x4 6.25Gbps | 点对点，低成本 |

## 八、可靠性与测试验证

1. **TDR 阻抗测试**：差分 100Ω，TDR 实测偏差 < ±10%；记录背板与板卡各段实测值。
2. **链路训练**：上电后 < 5ms 完成 CDR 锁定与链路训练；各速率（6.25/12.5/25.781/32.0Gbps）均满足。
3. **误码率**：Aurora 链路 BER < 10⁻¹²（CRC 16 错误计数，运行 24h）；各速率均满足。
4. **热插拔**：模拟 5000 次插拔，连接器插损变化 < 0.5dB @ 16GHz；链路训练成功率 100%。
5. **参考时钟抖动**：RMS < 1ps（12~20MHz），峰峰值 < 5ps；晶振选型 156.25MHz / 312.5MHz，抖动指标满足。
6. **ESD 测试**：IEC 61000-4-2，接触放电 ±4kV（SerDes 连接器），空气放电 ±8kV；链路无复位、无 CRC 错误。
7. **温度循环**：-40°C~+85°C，100 循环，无连接器插损变化、无背板层间脱焊。

## 九、设计检查清单

1. SerDes 连接器型号已确认（Molex/Samtec），插损 < 1.5dB @ 16GHz，镀层规格匹配。
2. 信号走线阻抗：差分 100Ω，TDR 实测偏差 < ±10%。
3. 多 lane 系统各 lane 偏斜 < 5ps（UltraScale），< 50ps（7 系列），已标注。
4. 接收端 100Ω 并接终端已放置（差分对两端各 50Ω 至 GND）。
5. 参考时钟 156.25MHz / 312.5MHz HCSL 走线等长匹配 < 5ps，长度 ≤ 10cm，下方完整 GND 铺铜。
6. FPGA 选型与 lane 数/速率匹配（Artix-7/Kintex-7/Virtex-7/UltraScale），已确认。
7. SerDes 芯片靠近连接器放置，走线 < 5cm；参考时钟远离高速差分对（≥ 2mm）。
8. GND 铺铜完整，SerDes 差分对下方 GND 过孔密度 ≥ 每 5mm 一个。
9. 已完成 TDR、链路训练、BER、热插拔、ESD 测试，指标满足产品要求。
10. 多设备系统软件寻址表已建立，帧长与 QoS 配置已确认。

> 注：本文为 Aurora 接口的通用设计说明。具体项目的 lane 数、速率、帧长与 QoS 配置最终以所用 FPGA 器件与 Xilinx IP 核的数据手册为准，关键指标应在样板阶段通过实测确定。
