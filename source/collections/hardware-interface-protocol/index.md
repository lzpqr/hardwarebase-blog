---
title: 硬件接口协议
date: 2026-10-07 10:00:00
type: page
comments: false
description: 按芯片级、板卡级、板间/背板、系统级与无线五个层级，系统整理硬件产品中最常用的接口协议及其选型要点。
permalink: collections/hardware-interface-protocol/
---

接口协议决定一块板能不能“连得起来”：引脚够不够、时钟怎么同步、抗干扰行不行、距离拉得开多远。这个合集把硬件产品里最常见的接口协议按互连距离分层整理，从芯片到芯片、板内、板间/背板、系统级，一直到无线，方便在方案设计和引脚规划阶段快速对照。

## 系列文章

| 序号 | 文章 | 主要内容 |
| --- | --- | --- |
| 1 | [硬件接口协议总览：五层互连的常用协议与选型要点](/posts/hardware-interface-protocol-overview/) | 五层互连模型、芯片级到无线的代表协议、参数速查表与选型要点 |
| 2 | [硬件接口协议之 I2C 接口](/posts/hardware-interface-protocol-i2c/) | 总线拓扑与速率等级、上拉电阻与总线电容计算、协议机制、读写时序、PCB 布局与可靠性验证 |
| 3 | [硬件接口协议之 SPI 接口](/posts/hardware-interface-protocol-spi/) | 信号定义与拓扑形式、CPOL/CPHA 时钟模式、片选时序、Flash 操作序列、端接与等长控制 |
| 4 | [硬件接口协议之 UART 接口](/posts/hardware-interface-protocol-uart/) | 电平标准（TTL/RS-232/RS-422/RS-485）、波特率误差预算、帧格式与流控、方向切换时序、终端与偏置 |
| 5 | [硬件接口协议之 I2S 接口](/posts/hardware-interface-protocol-i2s/) | 时钟体系与主从配置、对齐格式与 TDM 多通道、收发时序、地平面分区与音质可靠性验证 |
| 6 | [硬件接口协议之 SDIO 接口](/posts/hardware-interface-protocol-sdio/) | 信号与速率等级、上拉与总线电容、初始化序列与数据传输、卡座电源设计与热插拔可靠性验证 |
| 7 | [硬件接口协议之 JTAG-SWD 接口](/posts/hardware-interface-protocol-jtag-swd/) | JTAG/SWD 信号与连接器、TAP 状态机与帧结构、操作流程、量产烧录安全管控与可靠性验证 |
| 8 | [硬件接口协议之 USB 接口](/posts/hardware-interface-protocol-usb/) | 信号定义与速率版本、Type-C CC 逻辑与 PD 供电协商、传输类型与枚举流程、CC 防护与差分设计 |
| 9 | [硬件接口协议之 PCIe 接口](/posts/hardware-interface-protocol-pcie/) | 信号定义与速率代际、参考时钟架构、分层协议与链路训练、枚举配置流程与阻抗设计 |
| 10 | [硬件接口协议之 SATA 接口](/posts/hardware-interface-protocol-sata/) | 信号定义与速率协商、连接器形态、协议分层与帧结构、建链与读写流程、热插拔控制 |
| 11 | [硬件接口协议之 MIPI 接口](/posts/hardware-interface-protocol-mipi/) | lane 数与带宽核算、协议包结构与虚拟通道、上电与数据流时序、射频共存与包地隔离 |
| 12 | [硬件接口协议之 eDP 接口](/posts/hardware-interface-protocol-edp/) | 信号定义与速率链路、AUX 与热插拔、链路训练与 EDID 读取、上电与背光时序 |
| 13 | [硬件接口协议之 HDMI-DP 接口](/posts/hardware-interface-protocol-hdmi-dp/) | HDMI/DP 信号定义与版本速率、内容保护机制、连接输出流程、ESD 防护与兼容性矩阵 |

## 计划收录的内容

| 序号 | 主题 | 主要内容 | 状态 |
| --- | --- | --- | --- |
| 2 | 工业现场（CAN / RS-485 / Modbus） | 仲裁与错误处理、隔离收发、波特率与距离、EMC 与接地 | 规划中 |
| 4 | 无线（Wi-Fi / 蓝牙 / LoRa） | 频段与功率、天线匹配、功耗与协议栈、共存与干扰 | 规划中 |

> 注：本合集先建立"分层 + 速查"的框架，后续每篇围绕一类接口展开参数、布局、信号完整性与选型检查清单。
