/* eslint-disable class-methods-use-this */

// const SuperESSix = require('components/Test/SuperESSix');
//
// // function BaseESSix(){};
// class SubESSix extends SuperESSix {
//
//     propSub = 'propSub';
//
//     constructor(props) {
//         super(props);
//         this.state = {};
//         /* Super class functions can be referenced as though they
//         belonged to the sub class instance */
//         this.getContent = this.getContent.bind(this);
//     }
//
//     render() {
//         return (
//             <div>
//                 <div onClick={this.click}>Render Base ES6</div>
//                 <div>Super function call: {this.getContent()}</div>
//                 /* Super class properties can be referenced as though they
//                 belonged to the sub class instance */
//                 <div>{this.propSuper}</div>
//                 /* Render the super class within the sub class */
//                 <div>Super Render: {SuperESSix.prototype.render.call(this)}</div>
//             </div>
//         );
//     }
// }
//
// SubESSix.esSix = true;
