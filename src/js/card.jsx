import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class toStinkCoverVizCard extends React.Component {

  constructor(props) {
    super(props)

    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      schemaJSON: undefined,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined,
      languageTexts: undefined
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    if (this.props.optionalConfigSchemaJSON) {
      stateVar.optionalConfigSchemaJSON = this.props.optionalConfigSchemaJSON;
    }

    this.state = stateVar;
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  componentDidMount() {
    if (this.state.fetchingData) {
      axios.all([
        axios.get(this.props.dataURL),
        axios.get(this.props.optionalConfigURL),
        axios.get(this.props.optionalConfigSchemaURL)
      ])
      .then(axios.spread((card, opt_config, opt_config_schema) => {
        this.setState({
          fetchingData: false,
          dataJSON: card.data,
          optionalConfigJSON: opt_config.data,
          optionalConfigSchemaJSON: opt_config_schema.data,
          languageTexts: this.getLanguageTexts(card.data.data.language)
        });
      }));
      this.showCounter();
    }
  }

  showCounter() {
    setTimeout(function(){
      $('.animate-count').each(function () {
        $(this).prop('Counter',0).animate({
          Counter: $(this).text()
        },{
            duration: 2000,
            easing: 'swing',
            step: function (now) {
              $(this).text(Math.ceil(now));
            }
        });
      });
    },100)
  }

  getLanguageTexts(languageConfig) {
    let language = languageConfig ? languageConfig : "hindi",
      text_obj;

    switch(language.toLowerCase()) {
      case "hindi":
        text_obj = {
          font: "'Sarala', sans-serif"
        }
        break;
      default:
        text_obj = {
          font: undefined
        }
        break;
    }
    return text_obj;
  }

  renderCol16() {
    if (this.state.fetchingData ){
      return(<div>Loading</div>)
    } else {
      let data = this.state.dataJSON.data;

      let employed_count = data.count.employed_count.toString(),
        killed_count = data.count.killed_count.toString(),
        convicted_count = data.count.convicted_count.toString(),
        employed_arr = [],
        killed_arr = [],
        convicted_arr = []

      console.log(employed_arr, killed_arr, convicted_arr, "employed_arr")
      return(
        <div className="ms-cover">
          <img className="col16-banner" src={data.banner_image.desktop}/>
          <div className="employed-counter counter">
            <div className="animate-count single-counter ec-1">2</div>
            <div className="animate-count single-counter ec-2">4</div>
            <div className="animate-count single-counter ec-3">0</div>
            <div className="animate-count single-counter ec-4">4</div>
          </div>
          <div className="killed-counter counter">
            <div className="animate-count single-counter kc-1">0</div>
            <div className="animate-count single-counter kc-2">3</div>
            <div className="animate-count single-counter kc-3">6</div>
            <div className="animate-count single-counter kc-4">6</div>
          </div>
          <div className="convicted-counter counter">
            <div className="animate-count single-counter cc-1">0</div>
            <div className="animate-count single-counter cc-2">0</div>
            <div className="animate-count single-counter cc-3">0</div>
            <div className="animate-count single-counter cc-4">2</div>
          </div>
        </div>
      )
    }
  }

  renderCol4() {
    if (this.state.fetchingData) {
      return (<div>Loading</div>)
    } else {
      let data = this.state.dataJSON.data;
      return(
        <div className="ms-cover-mobile">
          <div className="banner-image">
            <img src={data.banner_image.desktop} height="250px"/>
          </div>     
          <div className="counter-parent">     
            <div className="m-employed-counter counter">
              <div className="animate-count m-single-counter m-ec-1">2</div>
              <div className="animate-count m-single-counter m-ec-2">4</div>
              <div className="animate-count m-single-counter m-ec-3">0</div>
              <div className="animate-count m-single-counter m-ec-4">4</div>
            </div>
            <div className="m-killed-counter counter">
              <div className="animate-count m-single-counter m-kc-1">0</div>
              <div className="animate-count m-single-counter m-kc-2">3</div>
              <div className="animate-count m-single-counter m-kc-3">6</div>
              <div className="animate-count m-single-counter m-kc-4">6</div>
            </div>
            <div className="m-convicted-counter counter">
              <div className="animate-count m-single-counter m-cc-1">0</div>
              <div className="animate-count m-single-counter m-cc-2">0</div>
              <div className="animate-count m-single-counter m-cc-3">0</div>
              <div className="animate-count m-single-counter m-cc-4">2</div>
            </div>
          </div>
        </div>
      )
    }
  }

  insertZero(count, arr, str) {
    let len = count.length;
    for (let i=0; i< len; i++) {
      switch (len) {
        case 1:
          arr.push(0);
          break;
        case 2: 
          arr.push(0);
          break;
        case 3:
          arr.push(0);
          break;
        case 4:
          arr.push(str.toString()[i]);
          break;
      }     
    }
    console.log(arr, "arr")
    return arr;
  }

  render() {
    switch(this.props.mode) {
      case 'col16' :
        return this.renderCol16();
        break;
      case 'col4':
        return this.renderCol4();
        break;
    }
  }
}
