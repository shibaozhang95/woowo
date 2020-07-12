function formatState (state) {
  let formattedState = '';

  switch (state) {
    case 'Victoria':
      formattedState = 'VIC';
      break;
    case 'New South Wales':
      formattedState = 'NSW';
      break;
    case 'Canberra':
      formattedState = 'ACT';
      break;
    case 'New South Wales':
      formattedState = 'NSW';
      break;
    case 'Queensland':
      formattedState = 'QLD';
      break;
    case 'South Australia':
      formattedState = 'SA';
      break;
    case 'Western Australia':
      formattedState = 'WA';
      break;
    case 'Tasmania':
      formattedState = 'TAS';
      break;
    case 'Northern Territory':
      formattedState = 'NT';
      break;
    default:
      formattedState = state;
      break;
  }

  return formattedState;
}

module.exports = {
  formatState
}