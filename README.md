# Motor Imagery EEG 数据可视化系统

一个用于可视化和分析运动想象（Motor Imagery）EEG数据的React前端应用。

## 功能特性

- **多通道EEG数据可视化**：支持8个不同通道的EEG信号实时展示
- **数据增强方法对比**：
  - 原始数据展示
  - GAN（生成对抗网络）数据增强
  - VAE（变分自编码器）数据增强
- **运动想象分类**：自动识别三种运动想象类型
  - 左手运动想象
  - 右手运动想象
  - 脚部运动想象
- **交互式图表**：使用Chart.js实现流畅的数据可视化
- **响应式设计**：适配各种屏幕尺寸

## 技术栈

- **React 18.2** - 前端框架
- **Vite 5.0** - 构建工具
- **Chart.js 4.4** - 数据可视化库
- **React-Chartjs-2** - Chart.js的React封装

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动并自动打开浏览器。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
EEG_front/
├── src/
│   ├── components/          # React组件
│   │   ├── EEGChart.jsx            # EEG信号图表组件
│   │   ├── ChannelSelector.jsx    # 通道选择器
│   │   ├── AugmentMethodSelector.jsx  # 数据增强方法选择器
│   │   └── ClassificationResult.jsx   # 分类结果展示
│   ├── data/               # 数据相关
│   │   └── mockData.js            # 模拟数据生成器
│   ├── App.jsx             # 主应用组件
│   ├── App.css             # 全局样式
│   └── main.jsx            # 应用入口
├── index.html              # HTML模板
├── vite.config.js          # Vite配置
└── package.json            # 项目配置
```

## 使用说明

1. **选择通道**：点击通道按钮（通道1-8）查看不同通道的EEG信号
2. **选择增强方法**：
   - 点击"原始数据"查看未处理的EEG信号
   - 点击"GAN增强"查看经过GAN处理的增强数据
   - 点击"VAE增强"查看经过VAE处理的增强数据
3. **查看分类结果**：右侧面板显示当前信号的运动想象分类结果及置信度

## 数据说明

本系统目前使用模拟数据进行演示：

- **采样率**：250 Hz
- **信号长度**：1000个采样点（4秒）
- **通道数**：8个通道
- **分类类别**：左手运动、右手运动、脚部运动

模拟数据基于真实EEG信号特征生成，包含Alpha波段（8-13 Hz）和Beta波段成分。

## 后续开发建议

- 集成真实的EEG数据源（通过API或文件上传）
- 添加实时数据流处理功能
- 实现更多的信号处理算法
- 添加时频分析功能（如STFT、小波变换）
- 支持数据导出功能
- 添加用户设置和配置保存

## 许可证

本项目仅供学习和演示使用。

## 作者

Motor Imagery EEG Visualization System © 2024
