import React from 'react';
import { render } from 'react-dom';
import EditCard from './src/js/edit_card.jsx';

ProtoGraph.Card.toStinkCoverVizCard.prototype.getData = function(data) {
    return this.containerInstance.exportData();
}

ProtoGraph.Card.toStinkCoverVizCard.prototype.renderSEO = function(data) {
    this.renderMode = 'SEO';
    return this.containerInstance.renderSEO();
}

ProtoGraph.Card.toStinkCoverVizCard.prototype.renderEdit = function(onPublishCallback) {
    this.mode = 'edit';
    this.onPublishCallback = onPublishCallback;
    ReactDOM.render( <
        EditCard selector = { this.options.selector }
        dataURL = { this.options.data_url }
        schemaURL = { this.options.schema_url }
        siteConfigURL = { this.options.site_config_url }
        uiSchemaURL = { this.options.ui_schema_url }
        onPublishCallback = { this.onPublishCallback }
        mode = { this.mode }
        ref = {
            (e) => {
                this.containerInstance = this.containerInstance || e;
            }
        }
        />,
        this.options.selector);
}