import React from 'react';
import { render } from 'react-dom';
import { all as axiosAll, get as axiosGet, spread as axiosSpread } from 'axios';
import Card from './card.jsx';
import JSONSchemaForm from '../../lib/js/react-jsonschema-form';

export default class editToStinkCoverVizCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      dataJSON: {},
      mode: "col16",
      publishing: false,
      schemaJSON: undefined,
      fetchingData: true,
      uiSchemaJSON: {}
    }
    this.toggleMode = this.toggleMode.bind(this);
  }

  exportData() {
    let getDataObj = {
      step: this.state.step,
      dataJSON: this.state.dataJSON,
      schemaJSON: this.state.schemaJSON,
    }
    getDataObj["name"] = "The Stink Cover Viz Card";
    // getDataObj["name"] = getDataObj.dataJSON.data.title_and_hint.title.substr(0,225); // Reduces the name to ensure the slug does not get too long
    return getDataObj;
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object.
    if (this.state.fetchingData){
      axiosAll([
        axiosGet(this.props.dataURL),
        axiosGet(this.props.schemaURL),
        axiosGet(this.props.siteConfigURL),
        axiosGet(this.props.uiSchemaURL)
      ])
      .then(axiosSpread((card, schema, site_config, uiSchema) => {
        let stateVars = {
          fetchingData: false,
          dataJSON: card.data,
          schemaJSON: schema.data,
          siteConfigs: site_config.data,
          uiSchemaJSON: uiSchema.data
        }
        this.setState(stateVars);
      }));
    }
  }

  onChangeHandler({formData}) {
    switch (this.state.step) {
      case 1:
        this.setState((prevStep, prop) => {
          let dataJSON = prevStep.dataJSON;
          dataJSON.data.count = formData;
          return {
            dataJSON: dataJSON
          }
        })
        break;
      case 2:
        this.setState((prevState, prop) => {
          let dataJSON = prevState.dataJSON;
          dataJSON.data.banner_image = formData;
          return {
            dataJSON: dataJSON
          }
        })
        break;
    }
  }

   onSubmitHandler({formData}) {
    switch(this.state.step) {
      case 1:
        this.setState((prevStep, prop) => {
          return {
            step: prevStep.step + 1
          }
        });
        break;
      case 2:
        if (typeof this.props.onPublishCallback === "function") {
          this.setState({ publishing: true });
          let publishCallback = this.props.onPublishCallback();
          publishCallback.then((message) => {
            this.setState({ publishing: false });
          });
        }
        break;
    }
  }

  renderSEO() {
    let d = this.state.dataJSON.data;
    console.log(d.count);
    
    let seo_blockquote = `<blockquote><p>Employed: ${d.count.employed_count}</p><p>Killed: ${d.count.killed_count}</p><p> Convicted: ${d.count.convicted_count}</p></blockquote>`
    return seo_blockquote;
  }

  getFormData() {
    switch(this.state.step) {
      case 1:
        return this.state.dataJSON.data.count;
        break;
      case 2:
        // console.log(this.state.dataJSON.data.data_points, "4th step sample")
        return this.state.dataJSON.data.banner_image;
        break;
    }
  }

  getSchemaJSON() {
    switch(this.state.step){
      case 1:
        // console.log(this.state.schemaJSON, "1th step schema")
        return this.state.schemaJSON.properties.data.properties.count;
        break;
      case 2:     
        // console.log(this.state.schemaJSON, "4th step schema")   
        return this.state.schemaJSON.properties.data.properties.banner_image;
        break;
    }
  }

  showLinkText() {
    switch(this.state.step) {
      case 1:
        return '';
        break;
      case 2:
        return '< Back';
        break;
    }
  }

  showButtonText() {
    switch(this.state.step) {
      case 1:
        return 'Next';
        break;
      case 2:
        return 'Publish';
        break;
    }
  }

  getUISchemaJSON() {
    switch(this.state.step) {
      case 1:
      case 2:
        return {}
        break;
      default:
        return {};
        break;
    }
  }

  onPrevHandler() {
    let prev_step = --this.state.step;
    this.setState({
      step: prev_step
    });
  }

  toggleMode(e) {
    let element = e.target.closest('a'),
      mode = element.getAttribute('data-mode');

    this.setState((prevState, props) => {
      let newMode;
      if (mode !== prevState.mode) {
        newMode = mode;
      } else {
        newMode = prevState.mode
      }

      return {
        mode: newMode
      }
    })
  }

  render() {
    if (this.state.fetchingData) {
      return(<div>Loading</div>)
    } else {
      return (
        <div className="proto-container">
          <div className="ui grid form-layout">
            <div className="row">
              <div className="four wide column proto-card-form protograph-scroll-form">
                <div>
                  <div className="section-title-text">Fill the form</div>
                  <div className="ui label proto-pull-right">
                    toStinkCoverVizCard
                  </div>
                </div>
                <JSONSchemaForm schema={this.getSchemaJSON()}
                  onSubmit={((e) => this.onSubmitHandler(e))}
                  onChange={((e) => this.onChangeHandler(e))}
                  uiSchema={this.getUISchemaJSON()}
                  formData = {this.getFormData()}>
                  <br/>
                  <a id="protograph-prev-link" className={`${this.state.publishing ? 'protograph-disable' : ''}`} onClick={((e) => this.onPrevHandler(e))}>{this.showLinkText()} </a>
                  <button type="submit" className={`${this.state.publishing ? 'ui primary loading disabled button' : ''} default-button protograph-primary-button`}>{this.showButtonText()}</button>
                </JSONSchemaForm>
              </div>
              <div className="twelve wide column proto-card-preview proto-share-card-div">
                <div className="protograph-menu-container">
                  <div className="ui compact menu">
                    <a className={`item ${this.state.mode === 'col16' ? 'active' : ''}`}
                      data-mode='col16'
                      onClick={this.toggleMode}
                    >
                      Col16
                    </a>
                    <a className={`item ${this.state.mode === 'col4' ? 'active' : ''}`}
                      data-mode='col4'
                      onClick={this.toggleMode}
                    >
                      Col4
                    </a>
                  </div>
                </div>
                <div className="protograph-app-holder">
                  <Card
                    mode={this.state.mode}
                    dataJSON={this.state.dataJSON}
                    schemaJSON={this.state.schemaJSON}
                    siteConfigs={this.state.siteConfigs}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}
