import axios from 'axios';

import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import ArticleCard from './components/ArticleCard';
import Filters from './components/Filters';


import CONFIG from './config';

import './App.css';
import './Loader.css';


function convertForCheckboxes(items) {
  return items.map(item => { 
      return {
        name: item, 
        selected: false
      }
    })
}


class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      'categories': [],
      'sources': [],
      'articles': {
        'items': [],
        'properties': {}
      },
    }

    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleSourcesChange = this.handleSourcesChange.bind(this);
    this.loadArticles = this.loadArticles.bind(this);
  }

  canLoadMoreArticles() {
    return this.state.articles.properties.first <
      this.state.articles.properties.last;
  }

  changeSelection(name, item) {
    this.setState((prevState) => {
      // reset articles
      let newState = prevState;
      newState.articles = {items: [], properties: {}}
      newState[name].map(i => {
        if (i.name === item.name) { i.selected = item.checked }
        return i;
      });
      this.loadArticles(0, newState);
      return {newState}
    });
  }

  loadArticles(b_start=0, state=null) {
    state = state ? state : this.state;

    b_start = b_start === 0 ? 0 : b_start * CONFIG.b_size;
    axios.get(CONFIG.base_url + '/query.json', {
      params: {
        b_start,
        _: new Date().getTime(),
        c4: state.categories.filter(
          category => category.selected
        ).map(category => category.name),
        c5: state.sources.filter(
          source => source.selected
        ).map(source => source.name)
      }
    })
    .then(resp => {
      this.setState((prevState) => {
        let articles = prevState.articles;
        articles.properties = resp.data.properties;
        resp.data.items.forEach(article => articles.items.push(article))
        return {articles}
      })
    });
  }

  handleCategoryChange(item) {
    this.changeSelection('categories', item)
  }

  handleSourcesChange(item) {
    this.changeSelection('sources', item)
  }

  componentDidMount() {
    axios.get(CONFIG.base_url + '/app.json', {
      params: {
        _: new Date().getTime()
      }
    })
    .then(resp => {
      const categories = convertForCheckboxes(resp.data.categories.items);
      const sources = convertForCheckboxes(resp.data.sources.items);
      this.setState({categories, sources})
    });
    this.loadArticles();
  }

  render() {
    let articles = this.state.articles.items;
    let hasMoreArticles = (
      this.state.articles.properties.first <
      this.state.articles.properties.last
    )
    return (
      <div className="App">
        <Filters 
          categories={this.state.categories} 
          sources={this.state.sources} 
          handleCategoryChange={this.handleCategoryChange}
          handleSourcesChange={this.handleSourcesChange}>
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadArticles}
            hasMore={hasMoreArticles}
            useWindow={false}
            loader="LOADING">
            {
              articles.map((article, idx) =>
                <ArticleCard key={idx} article={article} />
              )
            }
          </InfiniteScroll>
        </Filters>
      </div>
    );
  }
}

export default App;
