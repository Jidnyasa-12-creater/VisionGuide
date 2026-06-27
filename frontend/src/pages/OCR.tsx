import { AnalysisPage } from '../components/UI/AnalysisPage';
export function OCR() {
  return (
    <AnalysisPage
      title="Read Text (OCR)"
      subtitle="Extract and read aloud text from any image"
      analysisType="ocr"
      tips={[
        'Point camera at books, signs, labels, or documents',
        'Ensure text is well-lit and in focus',
        'Works with printed and handwritten text',
        'AI will read all visible text aloud after capture',
      ]}
    />
  );
}
