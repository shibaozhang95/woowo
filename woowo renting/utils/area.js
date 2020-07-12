export default class OneArea {
  constructor (locality, state, country, postCode) {
    this.locality = locality;
    this.state = state;
    this.country = country;
    this.postCode = postCode ? postCode : 0;

    this.ifChosen = false;
    this.formatAddress = this._formatAddress(); 
  }

  _formatAddress () {
    let address = this.locality + ' ' + this.state;

    if (this.postCode) {
      address += (' ' + this.postCode);
    }

    address += (', ' + this.country);

    return address;
  }

  formatAddrForHousemate () {
    let address = ''

    address += this.locality
    address += ','
    address += this.state
    address += ','
    address += this.country

    return address;
  }

  isEqual (oneArea) {
    if (this.country == oneArea.country) {
      if (this.state == oneArea.state) {
        if (this.locality == oneArea.locality) {
          return true;
        }
      }
    }

    return false;
  }

  outputToObj () {
    return {
      locality: this.locality,
      state: this.state,
      country: this.country,
      postCode: this.postCode
    }
  }
}