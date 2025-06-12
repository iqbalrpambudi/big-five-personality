import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (results, testDuration, traitMapping, traitDescriptions) => {
  // Create a temporary div to hold the content
  const content = document.createElement('div');
  content.style.padding = '20px';
  content.style.backgroundColor = 'white';
  content.style.width = '800px';
  
  // Add header
  const header = document.createElement('div');
  header.innerHTML = `
    <h1 style="text-align: center; color: #2563eb; margin-bottom: 20px;">Big Five Personality Test Results</h1>
    <p style="text-align: center; margin-bottom: 30px;">Test Duration: ${testDuration}</p>
  `;
  content.appendChild(header);

  // Add results
  Object.entries(results).forEach(([trait, score]) => {
    const { min, max } = traitMapping[trait];
    const percentage = ((score - min) / (max - min)) * 100;
    const interpretation = getInterpretation(trait, score, traitMapping, traitDescriptions);

    const resultDiv = document.createElement('div');
    resultDiv.style.marginBottom = '20px';
    resultDiv.style.padding = '15px';
    resultDiv.style.border = '1px solid #e5e7eb';
    resultDiv.style.borderRadius = '8px';
    
    resultDiv.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <h2 style="color: #1f2937; margin: 0; flex: 1;">${trait}</h2>
        <p style="color: #2563eb; font-weight: bold; margin: 0;">Score: ${score} / ${max}</p>
      </div>
      <div style="background-color: #e5e7eb; height: 20px; border-radius: 10px; margin-bottom: 10px;">
        <div style="background-color: #2563eb; height: 100%; width: ${percentage}%; border-radius: 10px;"></div>
      </div>
      <p style="color: #4b5563; margin: 0;">${interpretation}</p>
    `;
    
    content.appendChild(resultDiv);
  });

  // Add footer
  const footer = document.createElement('div');
  footer.innerHTML = `
    <p style="text-align: center; margin-top: 30px; color: #6b7280;">
      Thank you for taking the Big Five Personality Test!
    </p>
  `;
  content.appendChild(footer);

  // Add the content to the document
  document.body.appendChild(content);

  try {
    // Generate PDF
    const canvas = await html2canvas(content, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Clean up
    document.body.removeChild(content);
    
    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    document.body.removeChild(content);
    throw error;
  }
};

const getInterpretation = (traitName, score, traitMapping, traitDescriptions) => {
  const { min, max } = traitMapping[traitName];
  const range = max - min;
  const lowThreshold = min + range / 3;
  const highThreshold = min + (2 * range) / 3;

  if (score < lowThreshold) return traitDescriptions[traitName].Low;
  if (score <= highThreshold) return traitDescriptions[traitName].Moderate;
  return traitDescriptions[traitName].High;
}; 