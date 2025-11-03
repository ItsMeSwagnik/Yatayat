const generateChallanPDF = (challan) => {
  const isPaid = challan.status === 'Paid';
  const docType = isPaid ? 'PAYMENT RECEIPT' : 'TRAFFIC VIOLATION CHALLAN';
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('YATAYAT', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(docType, 105, 30, { align: 'center' });
  
  // Line separator
  doc.line(20, 35, 190, 35);
  
  // Content
  let yPos = 50;
  doc.setFontSize(12);
  
  const addRow = (label, value) => {
    doc.setFont(undefined, 'bold');
    doc.text(label, 20, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(value, 120, yPos);
    yPos += 10;
  };
  
  addRow('Challan ID:', challan.challanId);
  addRow('Vehicle Number:', challan.vehicleNumber);
  addRow('Violation Type:', challan.violationType.replace('_', ' ').toUpperCase());
  addRow('Date & Time:', new Date(challan.timestamp).toLocaleString());
  addRow('Location:', challan.location);
  addRow('Officer ID:', challan.officerId);
  
  // Fine amount in red
  doc.setFont(undefined, 'bold');
  doc.text('Fine Amount:', 20, yPos);
  doc.setTextColor(239, 68, 68);
  doc.setFontSize(14);
  doc.text(`Rs. ${challan.fineAmount}`, 120, yPos);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  yPos += 10;
  
  doc.setFont(undefined, 'bold');
  doc.text('Status:', 20, yPos);
  doc.setFont(undefined, 'normal');
  doc.text(challan.status, 120, yPos);
  yPos += 15;
  
  // Payment details for paid challans
  if (isPaid) {
    doc.setFillColor(240, 249, 255);
    doc.rect(15, yPos - 5, 180, 60, 'F');
    
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text('PAYMENT DETAILS', 20, yPos + 5);
    yPos += 15;
    
    doc.setFontSize(12);
    addRow('Payment Date:', new Date().toLocaleString());
    addRow('Payment Method:', 'Online');
    addRow('Transaction ID:', `TXN${Date.now()}`);
    
    doc.setFont(undefined, 'bold');
    doc.text('Amount Paid:', 20, yPos);
    doc.setTextColor(239, 68, 68);
    doc.text(`Rs. ${challan.fineAmount}`, 120, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 10;
    
    addRow('Payment Status:', 'SUCCESS');
    yPos += 10;
  }
  
  // Footer
  yPos = Math.max(yPos + 20, 250);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, yPos, { align: 'center' });
  yPos += 8;
  doc.text('System: Yatayat Traffic Management System', 105, yPos, { align: 'center' });
  
  if (isPaid) {
    yPos += 8;
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Thank you for your payment!', 105, yPos, { align: 'center' });
  }
  
  // Download PDF
  const filename = isPaid ? `Receipt_${challan.challanId}.pdf` : `Challan_${challan.challanId}.pdf`;
  doc.save(filename);
};