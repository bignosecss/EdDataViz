import { UploadMsg } from './components/UploadMsg';

export function setupUploadForm(formElement: HTMLFormElement) {

  // 初始化消息组件
  const msgDiv = new UploadMsg(document.querySelector<HTMLDivElement>('#app')!);

  formElement!.addEventListener('submit', async (event) => {
    event.preventDefault();

    const uploadedFile = document.querySelector<HTMLInputElement>('#fileInput')!.files?.[0];

    if (!uploadedFile) {
      msgDiv.showMessage('请选择一个文件。');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const response = await fetch('http://www.icedream61.com:8000/api/upload/file', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        msgDiv.showMessage('文件上传失败');
        throw new Error(`Response status: ${response.status}`);
      }
      
      const result = await response.json();
      msgDiv.showMessage(`文件上传成功: ${result.message}`);
      setTimeout(() => {
      window.location.reload();
      }, 2000);
      console.log('asda', result);
    }catch (error) {
      console.error('上传文件时出错：', error);
      msgDiv.showMessage('上传文件时出错。');
    }
  });
}