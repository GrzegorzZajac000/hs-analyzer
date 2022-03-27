import React from 'react';
import '../styles/ChainVariables.scss';
import { BaseComponent } from '../../../utilities';
import HeliumAPI from '../../../api/HeliumAPI';
import { toast } from 'react-toastify';
import ReactJson from 'react-json-view';

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

        toast.error('Something went wrong with Helium API. Try one more time', {
          theme: 'dark'
        });
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
                indentWidth={8}
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
