type ResponseProcessPayment = {
  transationId: string;
  status: string;
  billet: {
    url: string;
    barCode: string;
  };
  card: {
    id: string;
  };
  processorResponse: string;
}

export default ResponseProcessPayment;
