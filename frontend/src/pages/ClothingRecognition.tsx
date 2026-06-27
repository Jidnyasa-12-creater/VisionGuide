import { AnalysisPage } from '../components/UI/AnalysisPage';
export function ClothingRecognition() {
  return (
    <AnalysisPage
      title="Clothing Analysis"
      subtitle="Identify clothing type, color, and style"
      analysisType="clothing"
      tips={[
        'Point camera at the full outfit for best results',
        'AI detects: type, color, style, and accessories',
        'Style categories: Casual, Formal, Business, Sportswear, Traditional',
        'Works with multiple people in frame',
      ]}
    />
  );
}
