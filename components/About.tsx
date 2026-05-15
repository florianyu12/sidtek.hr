'use client';

import { Company } from '@/types';

interface AboutProps {
  company: Company;
}

export default function About({ company }: AboutProps) {
  const format = company.descriptionFormat || {};
  
  const textStyle: React.CSSProperties = {
    textAlign: format.textAlign || 'left',
    lineHeight: format.lineHeight || '1.75',
    letterSpacing: format.letterSpacing || 'normal',
    fontSize: format.fontSize || '18px',
    marginTop: format.paragraphSpacing ? `${format.paragraphSpacing}px` : '0',
  };

  const paragraphStyle: React.CSSProperties = {
    textIndent: format.textIndent ? `${format.textIndent}em` : '2em',
    marginBottom: format.paragraphSpacing ? `${format.paragraphSpacing}px` : '16px',
  };

  const renderParagraph = (text: string) => {
    const replacedText = text
      .replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>')
      .replace(/<i>(.*?)<\/i>/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<span style="text-decoration: underline;">$1</span>');
    
    return <span dangerouslySetInnerHTML={{ __html: replacedText }} />;
  };

  const paragraphs = company.description.split('\n').filter(p => p.trim());

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-primary mb-6">关于我们</h2>
            <div style={textStyle}>
              {paragraphs.map((paragraph, index) => (
                <p key={index} style={paragraphStyle}>
                  {renderParagraph(paragraph)}
                </p>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <img
              src={company.image}
              alt="公司展示"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
