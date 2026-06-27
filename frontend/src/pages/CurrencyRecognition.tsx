import { AnalysisPage } from '../components/UI/AnalysisPage';
export function CurrencyRecognition() {
  return (
    <AnalysisPage
      title="Currency Recognition"
      subtitle="Identify bills and coins by denomination"
      analysisType="currency"
      tips={[
        'Place note flat on a bright surface',
        'Ensure the full note is visible in frame',
        'Works with Indian Rupees, US Dollars, Euros, and more',
        'Coins: ensure both sides are clearly visible',
      ]}
    />
  );
}
