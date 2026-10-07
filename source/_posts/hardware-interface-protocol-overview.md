---
title: 硬件接口协议总览：五层互连的常用协议与选型要点
date: 2026-10-07 10:00:00
categories:
  - 硬件设计
tags:
  - 接口协议
  - 选型参考
  - 互连
description: 按芯片级、板卡级、板间/背板、系统级和无线五个层级梳理硬件产品最常用的接口协议，并给出速率、拓扑与选型要点速查。
permalink: posts/hardware-interface-protocol-overview/
cover:
---

硬件产品里的接口协议，本质上可以按“距离层级”来理解：从芯片到芯片、板内、板间/背板、系统级，再到无线。本文按这五个层级梳理最常用的接口协议，并给出选型要点，供硬件工程师在方案设计与引脚规划阶段参考。

## 一、按层级理解接口协议

接口协议按物理距离与互连规模，可划分为五个层级：

| 层级 | 典型场景 | 代表协议 |
| --- | --- | --- |
| 芯片级 / 板内 | 同一 PCB 上芯片之间 | I2C、SPI、UART、I2S、SDIO、GPIO、JTAG/SWD |
| 板卡级高速 | 板内高速串行 | PCIe、SATA、USB、MIPI CSI/DSI、eDP、LVDS |
| 板间 / 背板 | 板卡与背板之间 | VPX、CPCI、SRIO、Aurora、JESD204B、SerDes |
| 系统级 / 工业 | 设备与外部系统 | 以太网、CAN / CAN-FD、RS-232/485、Modbus、EtherCAT |
| 无线 | 脱离线缆的远距离 | Wi-Fi、蓝牙 / BLE、Zigbee、LoRa、NFC、4G/5G、GNSS |

距离越短，速率往往越低、协议越简单、引脚越少；距离越长，越依赖差分信号、总线仲裁和可靠传输机制。

## 二、芯片级与板内互连（低速、短线、省引脚）

- **I2C / I3C**：两线（SCL/SDA），多主多从，靠地址区分。最常用于传感器、EEPROM、PMIC 寄存器配置。I3C 向下兼容 I2C 且速率更高。
- **SPI**：四线（SCK/MOSI/MISO/CS），全双工同步，速率远高于 I2C，但每增加一个从机要多一根 CS。用于 Flash、ADC/DAC、显示屏、射频芯片配置。
- **UART**：异步、点对点，无时钟线，双方必须约定波特率。调试串口与模组通信的标配。
- **I2S / TDM**：音频专用同步串行，带 LRCLK 区分左右声道，用于音频 Codec、麦克风阵列。
- **SDIO**：4 线并行，速率可达数百 Mbps，SD 卡、Wi-Fi 模组、eMMC 走这个。
- **JTAG / SWD**：调试与烧录，SWD 只需 2 线，ARM 平台基本都用 SWD。

## 三、板卡级高速接口（差分、高速率）

- **USB**：2.0（480Mbps）→ 3.x / Type-C（5~20Gbps），支持热插拔与总线供电（USB-PD 最高 240W）。
- **PCIe**：每 lane Gen3 8GT/s、Gen4 16GT/s，可多 lane 聚合（x4/x8/x16），是扩展卡与高速板间互连的主力。
- **SATA**：硬盘 / SSD 存储接口，6Gbps。
- **MIPI D-PHY / CSI-2 / DSI**：摄像头和显示屏的标配，每 lane 1~4.5Gbps。
- **eDP / LVDS**：屏接口，LVDS 是老一代方案，eDP 更省线。
- **HDMI / DP**：对外显示输出。

## 四、板间与背板互连

- **VPX / CPCI / SRIO / Aurora / JESD204B**：军用、通信、雷达和高速采集板卡常用。JESD204B 是 ADC/DAC 到 FPGA 的专用高速串行接口，SRIO/Aurora 用于板间 10Gbps+ 互联。
- **SerDes**：泛指高速串行收发器技术，很多协议（PCIe/SATA/SRIO）底层都基于它。

## 五、系统级与工业现场

- **以太网**：100M/1G/10G，星型拓扑，支持 PoE 供电，工业现场常见环网冗余。
- **CAN / CAN-FD**：差分总线、多主仲裁、抗干扰强，汽车和工业设备的绝对主流。
- **RS-232 / RS-485**：232 点对点短距，485 总线半双工可长距（1200m），跑 Modbus 最普遍。
- **EtherCAT / Profinet / Modbus TCP**：工业实时以太网协议，跑在以太网物理层之上。

## 六、无线接口

Wi-Fi / 蓝牙 / BLE / Zigbee / LoRa / NFC / 4G-5G / GNSS：短距联网、低功耗组网、远距离传输、近场刷卡、定位授时各自定位清晰。

## 七、常用协议参数速查表

| 层级 | 协议 | 速率与拓扑 | 典型应用 |
| --- | --- | --- | --- |
| 板内 | I2C / I3C | 100k~3.4Mbps，两线多主多从 | 传感器、EEPROM、PMIC 配置 |
| 板内 | SPI | 数 Mbps~数十 Mbps，四线一主多从 | Flash、ADC/DAC、屏幕、射频配置 |
| 板内 | UART | 9600bps~1Mbps，两线点对点 | 调试串口、GPS/蓝牙模组 |
| 板内 | I2S / TDM | 随时钟，3~4 线同步 | 音频 Codec、麦克风阵列 |
| 板内 | SDIO | 最高数百 Mbps，4 线 | SD 卡、Wi-Fi 模组、eMMC |
| 板内 | JTAG / SWD | 低速，2~5 线 | 调试、烧录 |
| 板间 / 系统 | USB 2.0/3.x/Type-C | 480Mbps 至 20Gbps，主从差分 | 外设、下载、充电与 PD 供电 |
| 板间 / 系统 | PCIe | Gen3 8GT/s、Gen4 16GT/s 每 lane | 扩展卡、GPU、板间高速互连 |
| 板间 / 系统 | 以太网 | 100M / 1G / 10G，星型交换 | 网络通信、工业环网、PoE |
| 板间 / 系统 | CAN/CAN-FD、RS-485 | 1~8Mbps，总线多主 / 半双工 | 汽车电子、工业现场 |
| 板间 / 系统 | MIPI CSI/DSI、HDMI、DP | 每 lane 1~8Gbps，点对点差分 | 摄像头、LCD/OLED 屏、显示输出 |
| 无线 | Wi-Fi / 蓝牙 BLE | 数十~数百 Mbps / 低功耗短距 | 联网、配网、可穿戴 |
| 无线 | LoRa / Zigbee / NFC | 低速率、长距或近场 | 物联网组网、门禁刷卡 |
| 无线 | 4G / 5G / GNSS | 广域蜂窝，定位单向接收 | 远程传输、定位授时 |

## 八、选型要点

- **速率与距离**：板内低速选 I2C/SPI，跨板高速选 PCIe/以太网，长距低速率选 RS-485/LoRa。
- **同步还是异步**：有独立时钟线（SPI/I2S）更可靠，异步（UART）省线但依赖双方时钟精度。
- **拓扑**：点对点（UART/HDMI）、主从（SPI）、多主（I2C/CAN）、总线（RS-485）。
- **电气形式**：单端适合短线板内，差分（USB/PCIe/CAN/MIPI）抗干扰、可长距离高速度。
- **隔离与供电**：工业场合注意选带隔离的 CAN/485 收发器，PoE 和 USB-PD 可省掉独立电源。

> 注：本文为接口协议速查与选型参考，具体器件的电气参数（耐压、电流、速率）以原厂数据手册为准，设计中需留 50% 以上余量。
