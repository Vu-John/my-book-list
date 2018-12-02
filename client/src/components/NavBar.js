import React, { Component } from 'react';

class NavBar extends Component {
    render() {
        return(
            <div>
                <div class="ui secondary pointing menu">
                    <a class="active item">My Reading List</a>
                    <a class="item">Friends</a>
                    <div class="right menu">
                        <a class="ui item">Logout</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default NavBar;