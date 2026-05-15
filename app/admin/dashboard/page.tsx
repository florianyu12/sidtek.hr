'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SiteData, Job, EnvironmentImage } from '@/types';

type MenuItem = 'company' | 'contact' | 'environment' | 'jobs' | 'qrcode';

export default function AdminDashboard() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeMenu, setActiveMenu] = useState<MenuItem>('company');
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      router.push('/admin');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      const data = await res.json();
      setData(data);
    } catch {
      showMessage('error', '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (newData: SiteData) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('auth-token');
      const res = await fetch('/api/data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
        body: JSON.stringify(newData),
      });

      if (res.ok) {
        setData(newData);
        showMessage('success', '保存成功');
      } else {
        showMessage('error', '保存失败');
      }
    } catch {
      showMessage('error', '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    router.push('/admin');
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {message.text && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {message.text}
        </div>
      )}

      <div className="flex">
        <aside className="w-64 bg-primary text-white min-h-screen fixed left-0 top-0">
          <div className="p-6">
            <h1 className="text-xl font-bold mb-8">管理后台</h1>
            <nav className="space-y-2">
              <NavItem active={activeMenu === 'company'} onClick={() => setActiveMenu('company')}>
                网站信息
              </NavItem>
              <NavItem active={activeMenu === 'contact'} onClick={() => setActiveMenu('contact')}>
                联系方式
              </NavItem>
              <NavItem active={activeMenu === 'environment'} onClick={() => setActiveMenu('environment')}>
                环境图片
              </NavItem>
              <NavItem active={activeMenu === 'jobs'} onClick={() => setActiveMenu('jobs')}>
                岗位管理
              </NavItem>
              <NavItem active={activeMenu === 'qrcode'} onClick={() => setActiveMenu('qrcode')}>
                二维码设置
              </NavItem>
            </nav>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              退出登录
            </button>
          </div>
        </aside>

        <main className="flex-1 ml-64 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {activeMenu === 'company' && '网站信息管理'}
              {activeMenu === 'contact' && '联系方式管理'}
              {activeMenu === 'environment' && '环境图片管理'}
              {activeMenu === 'jobs' && '岗位管理'}
              {activeMenu === 'qrcode' && '二维码设置'}
            </h2>
            <a href="/" target="_blank" className="text-secondary hover:underline">
              查看网站 →
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            {activeMenu === 'company' && (
              <CompanyForm data={data} onSave={saveData} saving={saving} />
            )}
            {activeMenu === 'contact' && (
              <ContactForm data={data} onSave={saveData} saving={saving} />
            )}
            {activeMenu === 'environment' && (
              <EnvironmentForm data={data} onSave={saveData} saving={saving} />
            )}
            {activeMenu === 'jobs' && (
              <JobsForm
                data={data}
                onSave={saveData}
                saving={saving}
                onAddJob={() => { setEditingJob(null); setShowJobModal(true); }}
                onEditJob={(job) => { setEditingJob(job); setShowJobModal(true); }}
              />
            )}
            {activeMenu === 'qrcode' && (
              <QrcodeForm data={data} onSave={saveData} saving={saving} />
            )}
          </div>
        </main>
      </div>

      {showJobModal && (
        <JobModal
          job={editingJob}
          onClose={() => setShowJobModal(false)}
          onSave={(job) => {
            const newJobs = editingJob
              ? data.jobs.map(j => j.id === job.id ? job : j)
              : [...data.jobs, { ...job, id: `job-${Date.now()}` }];
            saveData({ ...data, jobs: newJobs });
            setShowJobModal(false);
          }}
        />
      )}
    </div>
  );
}

function insertText(formData: any, setFormData: any, field: string, before: string, after: string) {
  const currentValue = formData[field] || '';
  setFormData({
    ...formData,
    [field]: before + currentValue + after
  });
}

function NavItem({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
        active ? 'bg-secondary' : 'hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
}

function ImagePreview({ url }: { url: string }) {
  if (!url) return null;
  return (
    <div className="mt-2">
      <img src={url} alt="预览" className="max-w-xs rounded-lg border border-gray-200" />
    </div>
  );
}

function CompanyForm({ data, onSave, saving }: { data: SiteData; onSave: (data: SiteData) => void; saving: boolean }) {
  const format = data.company.descriptionFormat || {};
  const [formData, setFormData] = useState({
    name: data.company.name,
    logo: data.company.logo,
    logoSize: data.company.logoSize || 48,
    slogan: data.company.slogan,
    description: data.company.description,
    textAlign: format.textAlign || 'left',
    textIndent: format.textIndent || 2,
    lineHeight: format.lineHeight || '1.75',
    letterSpacing: format.letterSpacing || '0',
    fontSize: format.fontSize || '18px',
    paragraphSpacing: format.paragraphSpacing || 0,
    image: data.company.image,
    backgroundImage: data.company.backgroundImage,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...data,
      company: {
        ...formData,
        name: formData.name,
        logo: formData.logo,
        logoSize: parseInt(formData.logoSize.toString()) || 48,
        slogan: formData.slogan,
        description: formData.description,
        descriptionFormat: {
          textAlign: formData.textAlign as 'left' | 'center' | 'right' | 'justify',
          textIndent: parseInt(formData.textIndent.toString()) || 2,
          lineHeight: formData.lineHeight,
          letterSpacing: formData.letterSpacing,
          fontSize: formData.fontSize,
          paragraphSpacing: parseInt(formData.paragraphSpacing.toString()) || 0,
        },
        image: formData.image,
        backgroundImage: formData.backgroundImage,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="公司名称">
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
        />
      </FormField>
      <FormField label="公司 Logo URL">
        <input
          type="text"
          value={formData.logo}
          onChange={e => setFormData({ ...formData, logo: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
        />
        <ImagePreview url={formData.logo} />
      </FormField>
      <FormField label="Logo 尺寸 (像素)">
        <input
          type="number"
          min="20"
          max="120"
          value={formData.logoSize}
          onChange={e => setFormData({ ...formData, logoSize: parseInt(e.target.value) || 48 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
        />
        <p className="text-sm text-gray-500 mt-2">建议范围：20 - 120 像素</p>
      </FormField>
      <FormField label="招聘 Slogan">
        <input
          type="text"
          value={formData.slogan}
          onChange={e => setFormData({ ...formData, slogan: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
        />
      </FormField>
      <FormField label="公司简介">
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-300">
            <button
              onClick={() => insertText(formData, setFormData, 'description', '<b>', '</b>')}
              className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors font-bold"
            >B</button>
            <button
              onClick={() => insertText(formData, setFormData, 'description', '<i>', '</i>')}
              className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors italic"
            >I</button>
            <button
              onClick={() => insertText(formData, setFormData, 'description', '<u>', '</u>')}
              className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors underline"
            >U</button>
            <div className="w-px h-5 bg-gray-300 mx-1"></div>
            <button
              onClick={() => insertText(formData, setFormData, 'description', '', '\n')}
              className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >↵ 换行</button>
            <button
              onClick={() => insertText(formData, setFormData, 'description', '&nbsp;&nbsp;', '')}
              className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >↔ 缩进</button>
          </div>
          <textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 border-none focus:ring-0 outline-none resize-none"
            placeholder="输入公司简介内容，支持基本富文本格式..."
          />
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-300 text-xs text-gray-500">
            使用工具栏按钮添加格式，换行使用 Enter 键，段落会自动首行缩进
          </div>
        </div>
      </FormField>
      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">公司简介排版设置</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <FormField label="对齐方式">
            <select
              value={formData.textAlign}
              onChange={e => setFormData({ ...formData, textAlign: e.target.value as 'left' | 'center' | 'right' | 'justify' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
            >
              <option value="left">左对齐</option>
              <option value="center">居中</option>
              <option value="right">右对齐</option>
              <option value="justify">两端对齐</option>
            </select>
          </FormField>
          <FormField label="首行缩进 (em)">
            <input
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={formData.textIndent}
              onChange={e => setFormData({ ...formData, textIndent: parseFloat(e.target.value) || 2 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
            />
          </FormField>
          <FormField label="行高">
            <input
              type="number"
              min="1"
              max="3"
              step="0.1"
              value={formData.lineHeight}
              onChange={e => setFormData({ ...formData, lineHeight: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
            />
          </FormField>
          <FormField label="字间距 (px)">
            <input
              type="number"
              min="0"
              max="10"
              value={formData.letterSpacing}
              onChange={e => setFormData({ ...formData, letterSpacing: e.target.value + 'px' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
            />
          </FormField>
          <FormField label="字体大小">
            <select
              value={formData.fontSize}
              onChange={e => setFormData({ ...formData, fontSize: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
            >
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
              <option value="22px">22px</option>
              <option value="24px">24px</option>
            </select>
          </FormField>
          <FormField label="段落间距 (px)">
            <input
              type="number"
              min="0"
              max="50"
              value={formData.paragraphSpacing}
              onChange={e => setFormData({ ...formData, paragraphSpacing: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
            />
          </FormField>
        </div>
      </div>

      <FormField label="公司简介图片 URL">
        <input
          type="text"
          value={formData.image}
          onChange={e => setFormData({ ...formData, image: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
        />
        <ImagePreview url={formData.image} />
      </FormField>
      <FormField label="页面背景图 URL">
        <input
          type="text"
          value={formData.backgroundImage}
          onChange={e => setFormData({ ...formData, backgroundImage: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
        />
        <ImagePreview url={formData.backgroundImage} />
      </FormField>
      <button
        type="submit"
        disabled={saving}
        className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {saving ? '保存中...' : '保存'}
      </button>
    </form>
  );
}

function ContactForm({ data, onSave, saving }: { data: SiteData; onSave: (data: SiteData) => void; saving: boolean }) {
  const [formData, setFormData] = useState(data.contact);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...data, contact: formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="公司地址">
        <input
          type="text"
          value={formData.address}
          onChange={e => setFormData({ ...formData, address: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
        />
      </FormField>
      <FormField label="招聘邮箱">
        <input
          type="email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
        />
      </FormField>
      <FormField label="联系电话">
        <input
          type="text"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
        />
      </FormField>
      <button
        type="submit"
        disabled={saving}
        className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {saving ? '保存中...' : '保存'}
      </button>
    </form>
  );
}

function EnvironmentForm({ data, onSave, saving }: { data: SiteData; onSave: (data: SiteData) => void; saving: boolean }) {
  const [images, setImages] = useState<EnvironmentImage[]>(data.environmentImages);

  const addImage = () => {
    setImages([...images, { id: `img-${Date.now()}`, url: '', description: '' }]);
  };

  const updateImage = (id: string, field: 'url' | 'description', value: string) => {
    setImages(images.map(img => img.id === id ? { ...img, [field]: value } : img));
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...data, environmentImages: images });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {images.map((image, index) => (
        <div key={image.id} className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">图片 {index + 1}</span>
            <button
              type="button"
              onClick={() => removeImage(image.id)}
              className="text-red-600 hover:text-red-800"
            >
              删除
            </button>
          </div>
          <FormField label="图片 URL">
            <input
              type="text"
              value={image.url}
              onChange={e => updateImage(image.id, 'url', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
            />
            <ImagePreview url={image.url} />
          </FormField>
          <FormField label="图片描述">
            <input
              type="text"
              value={image.description}
              onChange={e => updateImage(image.id, 'description', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
            />
          </FormField>
        </div>
      ))}
      <button
        type="button"
        onClick={addImage}
        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
      >
        添加图片
      </button>
      <button
        type="submit"
        disabled={saving}
        className="block px-6 py-3 bg-secondary hover:bg-secondary/80 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {saving ? '保存中...' : '保存'}
      </button>
    </form>
  );
}

function JobsForm({ data, onSave, saving, onAddJob, onEditJob }: {
  data: SiteData;
  onSave: (data: SiteData) => void;
  saving: boolean;
  onAddJob: () => void;
  onEditJob: (job: Job) => void;
}) {
  const [filter, setFilter] = useState('全部');

  const categories = ['全部', '校园招聘', '社会招聘'];
  const filteredJobs = filter === '全部'
    ? data.jobs
    : data.jobs.filter(job => job.category === filter);

  const deleteJob = (id: string) => {
    if (confirm('确定要删除这个岗位吗？')) {
      onSave({ ...data, jobs: data.jobs.filter(j => j.id !== id) });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === cat ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={onAddJob}
          className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-white font-semibold rounded-lg transition-colors"
        >
          新增岗位
        </button>
      </div>

      <div className="space-y-4">
        {filteredJobs.map(job => (
          <div key={job.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-primary">{job.name}</h3>
                  <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                    {job.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {job.department} | {job.location} | {job.education}
                  {job.experience && ` | ${job.experience}年经验`}
                </p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{job.description}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onEditJob(job)}
                  className="px-4 py-2 bg-primary hover:bg-primary/80 text-white text-sm rounded-lg transition-colors"
                >
                  编辑
                </button>
                <button
                  onClick={() => deleteJob(job.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JobModal({ job, onClose, onSave }: { job: Job | null; onClose: () => void; onSave: (job: Job) => void }) {
  const [formData, setFormData] = useState<Job>(job || {
    id: '',
    name: '',
    category: '校园招聘',
    department: '',
    location: '',
    education: '本科',
    experience: '',
    description: '',
    applyUrl: 'https://form.jinshuju.net/f/example',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-primary">{job ? '编辑岗位' : '新增岗位'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="岗位名称">
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
              required
            />
          </FormField>
          <FormField label="招聘类别">
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
            >
              <option value="校园招聘">校园招聘</option>
              <option value="社会招聘">社会招聘</option>
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="部门">
              <input
                type="text"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                required
              />
            </FormField>
            <FormField label="工作地点">
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                required
              />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="学历要求">
              <select
                value={formData.education}
                onChange={e => setFormData({ ...formData, education: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
              >
                <option value="本科">本科</option>
                <option value="硕士">硕士</option>
                <option value="博士">博士</option>
              </select>
            </FormField>
            <FormField label="经验要求（社招）">
              <input
                type="text"
                value={formData.experience || ''}
                onChange={e => setFormData({ ...formData, experience: e.target.value })}
                placeholder="如：3年"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
              />
            </FormField>
          </div>
          <FormField label="职责描述">
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none resize-none"
              required
            />
          </FormField>
          <FormField label="投递链接">
            <input
              type="url"
              value={formData.applyUrl}
              onChange={e => setFormData({ ...formData, applyUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
              required
            />
          </FormField>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-secondary hover:bg-secondary/80 text-white font-semibold rounded-lg transition-colors"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function QrcodeForm({ data, onSave, saving }: { data: SiteData; onSave: (data: SiteData) => void; saving: boolean }) {
  const [formData, setFormData] = useState({ wechatQrcode: data.wechatQrcode });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...data, wechatQrcode: formData.wechatQrcode });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="微信公众号二维码图片 URL">
        <input
          type="text"
          value={formData.wechatQrcode}
          onChange={e => setFormData({ ...formData, wechatQrcode: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
        />
        <ImagePreview url={formData.wechatQrcode} />
      </FormField>
      <button
        type="submit"
        disabled={saving}
        className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {saving ? '保存中...' : '保存'}
      </button>
    </form>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}
