// 获取表单结构
export async function fetchFormStructure(formId: string) {
  const res = await fetch(`http://192.168.68.150:5000/api/forms/structure/${formId}`);
  if (!res.ok) throw new Error('无法获取表单结构');
  const json = await res.json();
  if (!json.success) throw new Error(json.message || '表单结构获取失败');
  return json.data;
}

// 提交问卷答案
export async function submitSurvey(payload: {
  formId: string;
  submissionData: Record<string, any>;
  completionTime?: number;
  submitterInfo?: { name?: string; email?: string };
}) {
  const res = await fetch('http://192.168.68.150:5000/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || '提交失败');
  return json.data;
} 