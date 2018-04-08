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
      languageTexts: undefined
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
    }

    this.state = stateVar;
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  componentDidMount() {
    if (this.state.fetchingData) {
      axios.all([
        axios.get(this.props.dataURL)
      ])
      .then(axios.spread((card) => {
        this.setState({
          fetchingData: false,
          dataJSON: card.data,
          languageTexts: this.getLanguageTexts(card.data.data.language)
        });
      }));
      // this.showCounter();
    }
  }

  showCounter() {
    setTimeout(function(){
      $('.animate-count2').each(function () {
        $(this).prop('Counter',0).animate({
          Counter: $(this).text()
        },{
            duration: 2000,
            easing: 'swing',
            step: function (now) {
              console.log(now, "========")
              $(this).text(Math.ceil(now));
            }
        });
      });
    },1000)
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

      let employed = this.insertZero(employed_count, employed_arr),
        killed = this.insertZero(killed_count, killed_arr),
        convicted = this.insertZero(convicted_count, convicted_arr)
      return(
        <div className="ms-cover">
          <img className="col16-banner" src={data.banner_image.desktop}/>
          <div className="employed-counter counter">
            <div className="animate-count2 single-counter ec-0">{employed[0]}</div>
            <div className="animate-count single-counter ec-1">{employed[1]}</div>
            <div className="animate-count single-counter ec-2">{employed[2]}</div>
            <div className="animate-count single-counter ec-3">{employed[3]}</div>
            <div className="animate-count single-counter ec-4">{employed[4]}</div>
          </div>
          <div className="killed-counter counter">
            <div className="animate-count single-counter kc-0">{killed[0]}</div>
            <div className="animate-count single-counter kc-1">{killed[1]}</div>
            <div className="animate-count single-counter kc-2">{killed[2]}</div>
            <div className="animate-count single-counter kc-3">{killed[3]}</div>
            <div className="animate-count single-counter kc-4">{killed[4]}</div>
          </div>
          <div className="convicted-counter counter">
            <div className="animate-count single-counter cc-0">{convicted[0]}</div>
            <div className="animate-count single-counter cc-1">{convicted[1]}</div>
            <div className="animate-count single-counter cc-2">{convicted[2]}</div>
            <div className="animate-count single-counter cc-3">{convicted[3]}</div>
            <div className="animate-count single-counter cc-4">{convicted[4]}</div>
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

      let employed_count = data.count.employed_count.toString(),
        killed_count = data.count.killed_count.toString(),
        convicted_count = data.count.convicted_count.toString(),
        employed_arr = [],
        killed_arr = [],
        convicted_arr = []

      let employed = this.insertZero(employed_count, employed_arr),
        killed = this.insertZero(killed_count, killed_arr),
        convicted = this.insertZero(convicted_count, convicted_arr)
      return(
        <div className="ms-cover-mobile">
          <div className="banner-image">
            <img src={data.banner_image.mobile} height="250px" width="100%"/>
          </div>
          <div className="counter-parent">
            <div className="m-employed-counter counter">
              <div className="animate-count m-single-counter m-ec-0">{employed[0]}</div>
              <div className="animate-count m-single-counter m-ec-1">{employed[1]}</div>
              <div className="animate-count m-single-counter m-ec-2">{employed[2]}</div>
              <div className="animate-count m-single-counter m-ec-3">{employed[3]}</div>
              <div className="animate-count m-single-counter m-ec-4">{employed[4]}</div>
            </div>
            <div className="m-killed-counter counter">
              <div className="animate-count m-single-counter m-kc-0">{killed[0]}</div>
              <div className="animate-count m-single-counter m-kc-1">{killed[1]}</div>
              <div className="animate-count m-single-counter m-kc-2">{killed[2]}</div>
              <div className="animate-count m-single-counter m-kc-3">{killed[3]}</div>
              <div className="animate-count m-single-counter m-kc-4">{killed[4]}</div>
            </div>
            <div className="m-convicted-counter counter">
              <div className="animate-count m-single-counter m-cc-0">{convicted[0]}</div>
              <div className="animate-count m-single-counter m-cc-1">{convicted[1]}</div>
              <div className="animate-count m-single-counter m-cc-2">{convicted[2]}</div>
              <div className="animate-count m-single-counter m-cc-3">{convicted[3]}</div>
              <div className="animate-count m-single-counter m-cc-4">{convicted[4]}</div>
            </div>
          </div>
        </div>
      )
    }
  }

  insertZero(str, arr) {
    let len = str.length;
    switch (len) {
      case 1:
        arr.unshift("","","","");
        break;
      case 2:
        arr.unshift("","", "");
        break;
      case 3:
        arr.unshift("", "");
        break;
      case 4:
        arr.unshift("");
        break;
      case 5:
        break;
    }
    for (let i=0; i< len; i++) {
      arr.push(str[i]);
    }
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
