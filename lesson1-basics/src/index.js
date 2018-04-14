import React from 'react';
import ReactDOM from 'react-dom';

const Hello = ({ name }) => <div>{`Hello ${name}!`}</div>;

ReactDOM.render(
    <Hello name="Mark" />,
    document.getElementById('app')
);
