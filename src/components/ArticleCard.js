import axios from 'axios';

import React, { Component } from 'react';
import LazyLoad from 'react-lazyload';

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

function Loader(props) {
    return (
        <div className="lazyPlaceholder">
            <div className="loader">
                <span className="dot dot_1"></span>
                <span className="dot dot_2"></span>
                <span className="dot dot_3"></span>
                <span className="dot dot_4"></span>
            </div>
        </div>
    )
}

function ArticleThumb(props) {
    let placeholder = <Loader />
    return (
        <div className="ArticleThumb">
            <LazyLoad height={200} overflow={true} placeholder={placeholder}>
                <img src={props.src} alt={props.alt} />
            </LazyLoad>
        </div>
    )
}

class ArticleCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fulltext: ''
        }
        this.expandArticle = this.expandArticle.bind(this);
    }

    expandArticle(evt) {
        evt.preventDefault();
        axios.get(CONFIG.base_url + '/diffbot.json', {
            params: {
                url: this.props.article.original,
                _: new Date().getTime()
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
                {
                    article.thumbnail ? 
                    <ArticleThumb src={article.thumbnail} alt={article.title} /> 
                    : null
                }                 
                <ArticleTitle text={article.title} url={article.original} />
                <ArticleSource text={article.source} time={article.date} />
                {
                    this.state.fulltext ? <br /> :
                    <ArticleSummary text={article.description} />
                }
                {
                    this.state.fulltext ? 
                    this.state.fulltext : 
                    <a href={article.original} onClick={this.expandArticle} target="_blank">
                        Citește articolul complet
                    </a>
                }
                
            </article>
        )
    }
}


export default ArticleCard;