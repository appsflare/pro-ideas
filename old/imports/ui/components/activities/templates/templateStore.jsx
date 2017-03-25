import React from 'react';
const templates = {};

export function registerTemplate({name, template}) {
    templates[name] = template;
}

export function renderItem(name, data) {

    if (!templates.hasOwnProperty(name)) {        
        return <li />
    }    
    return templates[name](data); 
}