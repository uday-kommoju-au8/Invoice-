import './pdf.css';
const pdfMake = window.pdfMake;
export function saveInvoicePDF(params) {
  if (params.imageLogo) {
    console.log('imageLogo', params.imageLogo);
    let fileReader = new FileReader();
    fileReader.addEventListener(
      'load',
      onDataURLLoaded.bind(null, params, fileReader),
      false,
    );
    fileReader.readAsDataURL(params.imageLogo);
  } else {
    createPDFFromParams(params);
  }
}

// Private functions
function onDataURLLoaded(params, fileReader) {
  // Set imageLogo to data URI of file
  params.imageLogo = fileReader.result;
  createPDFFromParams(params);
}

function createPDFFromParams(params) {
  let docDefinition = buildDocDefinition(params);
  pdfMake.createPdf(docDefinition).open();
}

function buildDocDefinition(params) {
  let notesAndTerms = buildNotesAndTerms(params);
  console.log('notesAndTerms', notesAndTerms);
  return {
    content: [
      buildHeaderInformation(params),
      buildLineItemsTable(params),
      buildSubTotal(params),
      buildCgst(params),
      buildSgst(params),
      buildTotal(params),
      ...buildNotesAndTerms(params),
    ],
  };
}

function buildHeaderInformation(params) {
  const optionalDataKeys = [];
  const optionalDataValues = [];

  Object.entries({
    Date: params.date
  }).forEach(([key, value]) => {
    if (value) {
      optionalDataKeys.push(key);
      optionalDataValues.push(value);
    }
  });

  return {
    columns: [
      {
        stack: [
          ...buildImageLogo(params),
          {
            text: "Bala Computers",
            fontSize:25,

          },
          {
            text: params.fromName,
            margin: [0, 30, 0, 30],
          },
          {
            text: 'Bill To',
            margin: [0, 0, 0, 0],
          },
          {
            text: params.toName,
          },
        ],
      },
      {
        stack: [
          {
            text: 'INVOICE',
            fontSize: 25,
          },
          {
            text: `# ${params.invoiceNumber}`,
            fontSize: 15,
            margin: [0, 0, 0, 30],
          },
          {
            columns: [
              {
                width: 50,
                text: '',
              },
              {
                width: '*',
                columns: [
                  {
                    stack: optionalDataKeys,
                    alignment: 'right',
                  },
                  {
                    stack: optionalDataValues,
                    alignment: 'right',
                  },
                ],
              },
            ],
          },
        ],
        alignment: 'right',
      },
    ],
    // optional space between columns
    columnGap: 10,
    margin: [0, 0, 0, 30],
  };
}

function buildLineItemsTable(params) {
  let lineItemRows = params.lineItems.map(buildLineItem(params));
  return {
    table: {
      widths: ['5%','*', '15%','11%','11%', '11%', '18%'],
      headerRows: 1,
      body: [
        [
          'Sno',
          'Item',
          {text:'HSN Acs', alignment:'right'},
          {text:'Serial', alignment:'right'},
          { text: 'Quantity', alignment: 'right' },
          { text: 'Rate', alignment: 'right' },
          { text: 'Amount', alignment: 'right' },
        ],
        ...lineItemRows,
        
      ],
    },
    layout: ['lightHorizontalLines','lightVerticalLines'],
    margin: [0, 0, 0, 10],
  };
}

function buildSubTotal(params) {
  let total = params.lineItems.reduce((sum, lineItem) => {
    return sum + lineItem.quantity * lineItem.rate;
  }, 0);
  return {
    table: {
      widths: ['*', '18%'],
      body: [
        [
          {
            text: 'SubTotal',
            alignment: 'right',
          },
          {
            text: `${total.toFixed(2)} `,
            alignment: 'right',
          },
        ],
      ],
    },
    layout: 'noBorders',
    margin: [0, 0, 0, 10],
  };
}

function buildCgst(params) {
  let total = params.lineItems.reduce((sum, lineItem) => {
    return ((sum + lineItem.quantity * lineItem.rate));
  }, 0);
  return {
    table: {
      widths: ['*', '18%'],
      body: [
        [
          {
            text: 'CGST Tax @9%',
            alignment: 'right',
          },
          {
            text: `${total.toFixed(2)*9/100} `,
            alignment: 'right',
          },
        ],
      ],
    },
    layout: 'noBorders',
    margin: [0, 0, 0, 10],
  };
}

function buildSgst(params) {
  let total = params.lineItems.reduce((sum, lineItem) => {
    return ((sum + lineItem.quantity * lineItem.rate));
  }, 0);
  return {
    table: {
      widths: ['*', '18%'],
      body: [
        [
          {
            text: 'SGST Tax @9%',
            alignment: 'right',
          },
          {
            text: `${total.toFixed(2)*9/100} `,
            alignment: 'right',
          },
        ],
      ],
    },
    layout: 'noBorders',
    margin: [0, 0, 0, 10],
  };
}


function buildTotal(params) {
  let total = params.lineItems.reduce((sum, lineItem) => {
    return (sum + lineItem.quantity * lineItem.rate);
  }, 0);
  return {
    table: {
      widths: ['*', '18%'],
      body: [
        [
          {
            text: 'Total',
            alignment: 'right',
          },
          {
            text: `${total+total.toFixed(2)*18/100} `,
            alignment: 'right',
          },
        ],
      ],
    },
    layout: 'noBorders',
    margin: [0, 0, 0, 30],
  };
}

// Returns an array
function buildNotesAndTerms(params) {
  let result = [];
  console.log('params', params);
  
  if (params.terms) {
    result = result.concat([
      { text: 'Terms and Conditions' },
      { text: params.terms, margin: [0, 0, 0, 30] },
    ]);
  }
  return result;
}

function buildLineItem(params) {
  return function buildLineItemCurried(lineItem) {
    return [
      {text:String(lineItem.Sno), alignment:'right'},
      lineItem.description,
      {text:String(lineItem.HSN), alignment:'right'},
      {text:String(lineItem.Serial), alignment:'right'},
      { text: String(lineItem.quantity), alignment: 'right' },
      { text: `${lineItem.rate} `, alignment: 'right' },
      {
        text: `${(lineItem.quantity * lineItem.rate).toFixed(2)} `,
        alignment: 'right',
      },
    ];
  };
}

function buildImageLogo(params) {
  let result = [];
  if (params.imageLogo) {
    result.push({
      image: params.imageLogo,
    });
  }
  return result;
}

