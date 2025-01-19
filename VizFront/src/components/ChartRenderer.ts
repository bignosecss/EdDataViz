import * as echarts from 'echarts';

export class ChartRenderer {
  private chart: echarts.ECharts;

  constructor(container: HTMLElement) {
    this.chart = echarts.init(container);
  }

  renderChart(data: any[]) {
    const dates = data.map((item) => item['日期']);
    const fullCorrectRates = data.map((item) => parseFloat(item['全对率'].replace('%', '')));
    const overallCorrectRates = data.map((item) => parseFloat(item['综合正确率'].replace('%', '')));

    const option = {
      title: {
        text: '学生正确率分析',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['全对率', '综合正确率'],
        bottom: 10,
      },
      xAxis: {
        type: 'category',
        data: dates,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%',
        },
      },
      series: [
        {
          name: '全对率',
          type: 'line',
          data: fullCorrectRates,
        },
        {
          name: '综合正确率',
          type: 'line',
          data: overallCorrectRates,
        },
      ],
    };

    this.chart.setOption(option);
  }

  showLoading() {
    this.chart.showLoading();
  }

  hideLoading() {
    this.chart.hideLoading();
  }

  showError(message: string) {
    this.chart.setOption({
      title: {
        text: message,
        left: 'center',
        textStyle: {
          color: 'red',
        },
      },
    });
  }
}