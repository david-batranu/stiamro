import Sidebar from'react-sidebar';

import React, { Component } from 'react';

import CheckboxList from './CheckBoxList';


const STYLES = {
    sidebar: {
        'backgroundColor': 'white',
    },
    content: {
        'backgroundColor': '#f9f9f9',
    },
}


class Filters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: false,
            sidebarDocked: false,
        }
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    }

    onSetSidebarOpen(open) {
        this.setState({sidebarOpen: open});
    }

    componentWillMount() {
        let mql = window.matchMedia(`(min-width: 800px)`);
        mql.addListener(this.mediaQueryChanged);
        this.setState({
            mql: mql, 
            sidebarDocked: mql.matches
        });
    }

    componentWillUnmount() {
        this.state.mql.removeListener(
            this.mediaQueryChanged
        );
    }

    mediaQueryChanged() {
        this.setState((prevState) => {
            return {
                sidebarDocked: prevState.mql.matches
            }
        });
    }

    render() {
        const sidebarContent = (
            <div className="App-Filters">
                <h2>Categorie</h2>
                <CheckboxList items={this.props.categories} onChange={this.props.handleCategoryChange} />
                <h2>Sursă</h2>
                <CheckboxList items={this.props.sources} onChange={this.props.handleSourcesChange} />
            </div>
        )

        return (
            <Sidebar styles={STYLES}
                sidebar={sidebarContent}
                open={this.state.sidebarOpen}
                docked={this.state.sidebarDocked}
                onSetOpen={this.onSetSidebarOpen}>
                {this.props.children}
            </Sidebar>
        )
    }
}


export default Filters;