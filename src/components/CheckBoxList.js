import React, { Component } from 'react';


class CheckboxListItem extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onChange({
      'name': e.target.value,
      'checked': e.target.checked
    });
  }

  render() {
    const value = this.props.value;
    const checked = this.props.checked;
    return (
      <li className="CheckboxListItem">
        <label>
          <span>{value}</span>
          <input 
            type="checkbox" 
            value={value} 
            checked={checked} 
            onChange={this.handleChange}
            />
        </label>
      </li>
    )
  }
}


class CheckboxList extends Component {
  render() {
    const items = this.props.items;
    return (
      <ul className="CheckboxList">
        {items.map((item) => 
            <CheckboxListItem 
              key={item.name} 
              value={item.name} 
              checked={item.selected}
              onChange={this.props.onChange}
              />
          )}
      </ul>
    );
  }
};


export default CheckboxList;