import './StudentDropdown.css';

export class StudentDropdown {
  private element: HTMLSelectElement;

  constructor(parent: HTMLElement) {
    this.element = document.createElement('select');
    this.element.id = 'student-dropdown';
    parent.appendChild(this.element);

    this.loadStudents();
  }

  getElement(): HTMLSelectElement {
    return this.element;
  }

  private async loadStudents() {
    try {
      const response = await fetch('https://www.icedream61.com/api/get-student-names');
      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.status}`);
      }

      const students = await response.json();
      const studentNames = students.student_names;
      this.renderOptions(studentNames);
    } catch (error) {
      console.error('Error loading students:', error);
      // 显示错误提示
      this.element.innerHTML = '<option value="">加载失败，请重试</option>';
      this.element.addEventListener('click', () => this.loadStudents(), { once: true });
    }
  }

  private renderOptions(studentNames: string[]) {
    // 清空现有选项
    this.element.innerHTML = '';

    // 添加默认选项
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '请选择学生';
    this.element.appendChild(defaultOption);

    // 添加学生选项
    studentNames.forEach((name) => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      this.element.appendChild(option);
    });
  }

  getSelectedStudent(): string {
    return this.element.value;
  }
}