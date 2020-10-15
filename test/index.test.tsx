import Test from '../src/pages/Test';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

configure({ adapter: new Adapter() })
test('Jest-TypeScript 尝试运行', () => {
    const renderer = shallow(<div>hello world</div>);
    expect(renderer.text()).toEqual('hello world')
})

test('Jest-TypeScript 尝试运行', () => {
    const renderer = shallow(<Test></Test>);
    expect(renderer.text()).toEqual('hello world')
})