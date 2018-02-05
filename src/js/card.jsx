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
      $('.single-counter').each(function () {
        $(this).prop('Counter',0).animate({
          Counter: $(this).text()
        },{
            duration: 1000,
            easing: 'swing',
            step: function (now) {
              $(this).text(Math.ceil(now));
            }
        });
      });
    },500)
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

      // let employed_count = data.count.employed_count.toString().length,
      //   killed_count = data.count.killed_count.toString().length,
      //   convicted_count = data.count.convicted_count.toString().length;

      // for (let i=0; i< employed_count; i++) {

      // }
      return(
        <div className="ms-cover">
          <img src={data.banner_image.desktop} width="1260px;"/>
          <div className="employed-counter counter">
            <div className="single-counter ec-1">2</div>
            <div className="single-counter ec-2">1</div>
            <div className="single-counter ec-3">3</div>
            <div className="single-counter ec-4">7</div>
          </div>
          <div className="killed-counter counter">
            <div className="single-counter kc-1">4</div>
            <div className="single-counter kc-2">1</div>
            <div className="single-counter kc-3">4</div>
          </div>
          <div className="convicted-counter counter">
            <div className="single-counter cc-1">0</div>
            <div className="single-counter cc-2">0</div>
            <div className="single-counter cc-3">2</div>
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
        <div className="ms-cover">
          <div className="banner-image-div">
            <img src={data.banner_image.desktop}/>
          </div>
          <div className="employed-counter counter">
            <div className="single-counter ec-1">2</div>
            <div className="single-counter ec-2">1</div>
            <div className="single-counter ec-3">3</div>
            <div className="single-counter ec-4">7</div>
          </div>
          <div className="killed-counter counter">
            <div className="single-counter kc-1">4</div>
            <div className="single-counter kc-2">1</div>
            <div className="single-counter kc-3">4</div>
          </div>
        </div>
      )
    }
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
