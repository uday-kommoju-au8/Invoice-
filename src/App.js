import React, { useState } from 'react';
import {
  Button,
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  PageHeader,
} from 'react-bootstrap';
import { symbols } from 'currencyformatter.js';
import dequal from 'dequal';
import 'bootstrap/dist/css/bootstrap.css';

import './App.css';
import LineItemList from './LineItemList.js';
import { saveInvoicePDF } from './PDFService.js';
import useLocalStorage from './useLocalStorage.ts';

const currencyCodes = Object.keys(symbols);

const emptyState = {
  invoiceNumber: '1',
  fromName: 'Bala Computers\nNear Hansi Kalyan Mandapam\nBhimavaram - 534205\n9052037181',
  paymentTerms: '',
  currency: 'INR',
  toName: '',
  date: '',
  lineItems: [],
  notes: 'This invoice does not include service fees.',
  terms: '',
};

function App() {
  const [editedInvoice, setEditedInvoice] = useState(emptyState);
  const [historyStates, setHistoryStates] = useLocalStorage(
    'invoiceHistory',
    [],
  );

  function onFieldValueChange(propertyName, event) {
    let newVal = event.target.value;
    let stateUpdate = {};
    stateUpdate[propertyName] = newVal;
    setEditedInvoice({
      ...editedInvoice,
      ...stateUpdate,
    });
  }

  function onLineItemSnoChange(params) {
    let lineItems = editedInvoice.lineItems;
    let lineItem = lineItems[params.index];
    lineItem.Sno = params.newSno;
    setEditedInvoice({
      ...editedInvoice,
      lineItems: lineItems,
    });
  }

  function onLineItemDescriptionChange(params) {
    let lineItems = editedInvoice.lineItems;
    let lineItem = lineItems[params.index];
    lineItem.description = params.newDescription;
    setEditedInvoice({
      ...editedInvoice,
      lineItems: lineItems,
    });
  }
  function onLineItemHSNChange(params) {
    let lineItems = editedInvoice.lineItems;
    let lineItem = lineItems[params.index];
    lineItem.HSN = params.newHSN;
    setEditedInvoice({
      ...editedInvoice,
      lineItems: lineItems,
    });
  }
  function onLineItemSerialChange(params) {
    let lineItems = editedInvoice.lineItems;
    let lineItem = lineItems[params.index];
    lineItem.Serial = params.newSerial;
    setEditedInvoice({
      ...editedInvoice,
      lineItems: lineItems,
    });
  }

  function onLineItemQuantityChange(params) {
    let lineItems = editedInvoice.lineItems;
    let lineItem = lineItems[params.index];
    lineItem.quantity = params.newQuantity;
    setEditedInvoice({
      ...editedInvoice,
      lineItems: lineItems,
    });
  }

  function onLineItemRateChange(params) {
    let lineItems = editedInvoice.lineItems;
    let lineItem = lineItems[params.index];
    lineItem.rate = params.newRate;
    setEditedInvoice({
      ...editedInvoice,
      lineItems: lineItems,
    });
  }

  function onLineItemDeleteClick(params) {
    let lineItems = editedInvoice.lineItems;
    lineItems.splice(params.index, 1);
    setEditedInvoice({
      ...editedInvoice,
      lineItems: lineItems,
    });
  }

  function onLineItemAddClick() {
    let lineItems = editedInvoice.lineItems;
    lineItems.push({
      description: '',
      quantity: 0,
      rate: 0,
    });
    setEditedInvoice({
      ...editedInvoice,
      lineItems: lineItems,
    });
  }

  function onExampleLinkClick() {
    setEditedInvoice({
      ...editedInvoice,
      invoiceNumber: '1',
      fromName: 'Bala Computers\nNear Hansi Kalyan Mandapam\nBhimavaram - 534205\n9052037181',
      currency: 'INR',
      toName: 'Uday Kommoju\nNear Over Bridge\nBhimavaram',
      date: '2020-10-10',
      lineItems: [
        {
          Sno:'1',
          description: 'Item #1',
          HSN:'Hello',
          Serial:"1111",
          quantity: 1,
          rate: 100,
        },
        {
          Sno:'2',
          description: 'Item #2',
          HSN:'Hello',
          Serial:"1211",
          quantity: 2,
          rate: 200,
        },
      ],
      
      terms: '1. Goods once sold cannot be taken back\n2. No Warranty for Physical damages & Burnings ',
    });
  }

  function onClearFormClick() {
    setEditedInvoice(emptyState);
  }


  function onSubmitClick() {
    saveInvoicePDF(editedInvoice);
    if (!dequal(editedInvoice, historyStates[0])) {
      setHistoryStates([editedInvoice, ...historyStates.slice(0, 24)]);
    }
  }


  return (
    <div className="App">
      <div className="Form">
        <PageHeader>Invoice Generator</PageHeader>
        <p>
          This is an invoice generator. Fill in the fields below and click
          'Create Invoice' to generate the invoice as a PDF document.{' '}
          <button onClick={onExampleLinkClick}>Click here</button> to see an
          example.
        </p>
        <div className="App-invoice">
          <Form horizontal>
            <FormGroup controlId="invoiceNumber">
              <Col componentClass={ControlLabel} sm={2}>
                Invoice #
              </Col>
              <Col sm={10}>
                <FormControl
                  type="text"
                  value={editedInvoice.invoiceNumber}
                  onChange={onFieldValueChange.bind(this, 'invoiceNumber')}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="fromName">
              <Col componentClass={ControlLabel} sm={2}>
                From
              </Col>
              <Col sm={10}>
                <FormControl
                  componentClass="textarea"
                  rows="3"
                  placeholder="Who is this invoice from?"
                  value={editedInvoice.fromName}
                  onChange={onFieldValueChange.bind(this, 'fromName')}
                />
              </Col>
            </FormGroup>
            
            <FormGroup controlId="toName">
              <Col componentClass={ControlLabel} sm={2}>
                Bill To
              </Col>
              <Col sm={10}>
                <FormControl
                  componentClass="textarea"
                  rows="3"
                  placeholder="Who is this invoice to?"
                  value={editedInvoice.toName}
                  onChange={onFieldValueChange.bind(this, 'toName')}
                />
              </Col>
            </FormGroup>
            <FormGroup controlId="date">
              <Col componentClass={ControlLabel} sm={2}>
                Date
              </Col>
              <Col sm={10}>
                <FormControl
                  type="date"
                  value={editedInvoice.date}
                  onChange={onFieldValueChange.bind(this, 'date')}
                />
              </Col>
            </FormGroup>
            
            
            <FormGroup controlId="currency">
              <Col componentClass={ControlLabel} sm={2}>
                Currency
              </Col>
              <Col sm={10}>
                <FormControl
                  componentClass="select"
                  placeholder="Select currency"
                  defaultValue={editedInvoice.currency}
                  onChange={onFieldValueChange.bind(this, 'currency')}
                >
                  {currencyCodes.map((currencyCode, index) => (
                    <option value={currencyCode} key={index}>
                      {currencyCode}
                    </option>
                  ))}
                </FormControl>
              </Col>
            </FormGroup>
            <LineItemList
              lineItems={editedInvoice.lineItems}
              currency={editedInvoice.currency}
              onLineItemSnoChange={onLineItemSnoChange}
              onLineItemDescriptionChange={onLineItemDescriptionChange}
              onLineItemHSNChange={onLineItemHSNChange}
              onLineItemSerialChange={onLineItemSerialChange}
              onLineItemQuantityChange={onLineItemQuantityChange}
              onLineItemRateChange={onLineItemRateChange}
              onLineItemDeleteClick={onLineItemDeleteClick}
              onLineItemAddClick={onLineItemAddClick}
            />
            
            <FormGroup>
              <ControlLabel>Terms and Conditions</ControlLabel>
              <FormControl
                componentClass="textarea"
                placeholder="1. Goods once sold cannot be taken back
                             2. No Warranty for Physical damages & Burnings"
                value={editedInvoice.terms}
                onChange={onFieldValueChange.bind(this, 'terms')}
              />
            </FormGroup>
          </Form>
        </div>
        <div className="Footer-Container">
          <div className="Footer">
            <Col sm={2}>
              <Button onClick={onClearFormClick} className="Footbtn">Clear Form</Button>
            </Col>
            <Col smOffset={8} sm={2}>
              <Button onClick={onSubmitClick} bsStyle="primary" className="Footbtn">
                Create Invoice
              </Button>
            </Col>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default App;
