import './style.css'
import { setupUploadForm } from './formHandler'
import { StudentDropdown } from './components/StudentDropdown';
import { ChartRenderer } from './components/ChartRenderer';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="page-container">
    <form id="uploadForm" class="upload-form">
      <input type="file" id="fileInput" name="file" accept=".xlsx" required />
      <button type="submit" class="upload-button">Upload</button>
    </form>
    <div id="dropdown-container" class="dropdown-container"></div>
    <div id="chart-container" style="width: 100%; height: 400px;"></div>
  </div>
`

setupUploadForm(document.querySelector<HTMLFormElement>('#uploadForm')!);

// 初始化下拉选项组件
const dropdownContainer = document.querySelector<HTMLDivElement>('#dropdown-container')!;
const studentDropdown = new StudentDropdown(dropdownContainer);

// 初始化 ECharts 图表容器
const chartContainer = document.querySelector<HTMLDivElement>('#chart-container')!;
const chartRenderer = new ChartRenderer(chartContainer);

// 监听下拉菜单变化
studentDropdown.getElement().addEventListener('change', async () => {
  const selectedStudent = studentDropdown.getSelectedStudent();
  if (!selectedStudent) return;

  try {
    chartRenderer.showLoading();

    // 获取学生数据
    const response = await fetch(`http://127.0.0.1:8000/api/get-student-data/${selectedStudent}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const result = await response.json();
    console.log('API Response:', result);

    // 从对象中提取对应学生的数据
    const studentData = result[selectedStudent];
    if (!studentData) {
      throw new Error(`No data found for student: ${selectedStudent}`);
    }

    chartRenderer.renderChart(studentData);
  } catch (error) {
    console.error('Error fetching student data:', error);
    chartRenderer.showError('数据加载失败，请重试');
  } finally {
    chartRenderer.hideLoading();
  }
});
