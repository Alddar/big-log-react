import {
    Link,
  } from '@tanstack/react-router'

const Root = () => (
    <ul>
        <li><Link to="/logs/$logName" params={{logName: 'log1'}}>Log1</Link></li>
        <li><Link to="/logs/$logName" params={{logName: 'log2'}}>Log2</Link></li>
    </ul>
  );

  export default Root
