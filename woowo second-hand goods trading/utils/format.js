function formatState (state) {
  let formattedState = '';

  switch (state) {
    case 'VIC':
      formattedState = 'Victoria';
      break;
    case 'NSW':
      formattedState = 'New South Wales';
      break;
    case 'ACT':
      formattedState = 'Canberra';
      break;
    case 'QLD':
      formattedState = 'Queensland';
      break;
    case 'SA':
      formattedState = 'South Australia';
      break;
    case 'WA':
      formattedState = 'Western Australia';
      break;
    case 'TAS':
      formattedState = 'Tasmania';
      break;
    case 'NT':
      formattedState = 'Northern Territory';
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