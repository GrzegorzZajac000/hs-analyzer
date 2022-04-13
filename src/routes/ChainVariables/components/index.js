import React from 'react';
import '../styles/ChainVariables.scss';
import { BaseComponent, sendErrorToast } from '../../../utilities';
import HeliumAPI from '../../../api/HeliumAPI';
import ReactJson from 'react-json-view';
import { captureException } from '@sentry/react';

class ChainVariables extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      data: [],
      loaded: false
    };
  }

  componentDidMount () {
    HeliumAPI.getChainVariables()
      .then(res => {
        this.updateState({ data: res.data.data, loaded: true });
      })
      .catch(err => {
        console.error(err);
        captureException(err);
        sendErrorToast('Something went wrong with Helium API. Try one more time');
      });
  }

  render () {
    return (
      <section className='chain-variables route-section'>
        <div className='row'>
          <div className='col-12'>
            <h2>Chain Variables</h2>

            <div className='chain-variables-object'>
              <ReactJson
                src={this.state.data}
                theme='ocean'
                iconStyle='triangle'
                indentWidth={4}
                collapsed={false}
                enableClipboard={false}
                displayDataTypes={false}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default ChainVariables;
