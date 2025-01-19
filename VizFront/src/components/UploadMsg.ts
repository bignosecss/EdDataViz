import './UploadMsg.css';

export class UploadMsg {
  private element: HTMLDivElement;

  constructor(parent: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'message-popup'; // 使用类名而不是 id
    parent.appendChild(this.element); // 将消息组件插入到指定的父容器中
  }

  showMessage(message: string, duration: number = 2000): void {
    this.element.textContent = message;
    this.element.classList.add('show'); // 添加显示动画

    setTimeout(() => {
      this.element.classList.remove('show'); // 添加隐藏动画
      setTimeout(() => {
        this.element.textContent = ''; // 清空内容
      }, 300); // 等待动画结束后清空内容
    }, duration);
  }
}