import axios from 'axios';

import React, { Component } from 'react';

import CONFIG from '../config';


function ArticleTitle(props) {
    return (
        <h1>
            <a href={props.url} target="_blank">{props.text}</a>
        </h1>
    )
}
    
function ArticleSource(props) {    
    return (<em>{props.text} &ndash; <time>{props.time}</time></em>)
}

function ArticleSummary(props) {
    return (<p>{props.text}</p>)
}

function ArticleThumb(props) {
    return (<img src={props.src} alt={props.alt} />)
}

class ArticleCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fulltext: ''
        }
        this.expandArticle = this.expandArticle.bind(this);
    }

    expandArticle() {
        axios.get(CONFIG.base_url + '/diffbot.json', {
            params: {
                url: this.props.article.original
            }
        })
        .then(resp => {
            let fulltext = resp.data.text;
            this.setState({fulltext})
        })
    }

    render() {
        let article = this.props.article;
        return (
            <article>
                <ArticleTitle text={article.title} url={article.original} />
                {
                    article.thumbnail ? 
                    <ArticleThumb src={article.thumbnail} alt={article.title} /> 
                    : null
                }                 
                <br />
                <ArticleSource text={article.source} time={article.date} />
                <ArticleSummary text={article.description} />
                {
                    this.state.fulltext ? 
                    this.state.fulltext
                    : <button onClick={this.expandArticle}>Citește articolul complet</button>
                }
                
            </article>
        )
    }
}


export default ArticleCard;