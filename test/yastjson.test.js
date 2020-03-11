/**
 * Copyright (c) 2020 5u9ar (zhuyingda)
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const assert = require('assert');

describe('yastjson unit test', function() {
    const { Tokenizer, AST, parse } = require('../index');

    describe('test sample array:', function() {
        const json = '{"arr": [1, 2, 3]}';
        const tokenizer = new Tokenizer();
        const tokens = tokenizer.tokenize(json);

        it('test lexical analysis result', function () {
            assert.equal(tokens[0].getText(), '{');
            assert.equal(tokens[1].getText(), '"arr"');
            assert.equal(tokens[2].getText(), ':');
            assert.equal(tokens[3].getText(), '[');
            assert.equal(tokens[4].getText(), '1');
            assert.equal(tokens[5].getText(), ',');
            assert.equal(tokens[6].getText(), '2');
            assert.equal(tokens[7].getText(), ',');
            assert.equal(tokens[8].getText(), '3');
            assert.equal(tokens[9].getText(), ']');
            assert.equal(tokens[10].getText(), '}');
        });

        const astHandler = new AST(tokens);
        const ast = astHandler.buildTree();

        it('test syntax parsing result', function () {
            assert.equal(ast.type, 'json');
            assert.equal(ast.childNodeList[0].type, 'object');
            assert.equal(ast.childNodeList[0].childNodeList[0].type, 'prop');
            assert.equal(ast.childNodeList[0].childNodeList[0].propName, 'arr');
            assert.equal(ast.childNodeList[0].childNodeList[0].childNodeList[0].type, 'value');
            assert.equal(ast.childNodeList[0].childNodeList[0].childNodeList[0].value.childNodeList[0].type, 'array');
            const arrayNode = ast.childNodeList[0].childNodeList[0].childNodeList[0].value.childNodeList[0];
            assert.equal(arrayNode.childNodeList[0].type, 'value');
            assert.equal(arrayNode.childNodeList[0].value.type, 'number');
            assert.equal(arrayNode.childNodeList[0].value.tokens[0].getText(), '1');
            assert.equal(arrayNode.childNodeList[1].type, 'value');
            assert.equal(arrayNode.childNodeList[1].value.type, 'number');
            assert.equal(arrayNode.childNodeList[1].value.tokens[0].getText(), '2');
            assert.equal(arrayNode.childNodeList[2].type, 'value');
            assert.equal(arrayNode.childNodeList[2].value.type, 'number');
            assert.equal(arrayNode.childNodeList[2].value.tokens[0].getText(), '3');
        });

        it('test output result', function () {
            let jsonGet = parse(json);
            assert.equal(JSON.stringify(JSON.parse(json)), JSON.stringify(jsonGet));
        });
    });

    describe('test sample object:', function() {
        const json = '{"a":1, "b":2, "c":3}';
        const tokenizer = new Tokenizer();
        const tokens = tokenizer.tokenize(json);

        it('test lexical analysis result', function () {
            assert.equal(tokens[0].getText(), '{');
            assert.equal(tokens[1].getText(), '"a"');
            assert.equal(tokens[2].getText(), ':');
            assert.equal(tokens[3].getText(), '1');
            assert.equal(tokens[4].getText(), ',');
            assert.equal(tokens[5].getText(), '"b"');
            assert.equal(tokens[6].getText(), ':');
            assert.equal(tokens[7].getText(), '2');
            assert.equal(tokens[8].getText(), ',');
            assert.equal(tokens[9].getText(), '"c"');
            assert.equal(tokens[10].getText(), ':');
            assert.equal(tokens[11].getText(), '3');
            assert.equal(tokens[12].getText(), '}');
        });

        const astHandler = new AST(tokens);
        const ast = astHandler.buildTree();

        it('test syntax parsing result', function () {
            assert.equal(ast.type, 'json');
            assert.equal(ast.childNodeList[0].type, 'object');
            const objectNode = ast.childNodeList[0];
            assert.equal(objectNode.childNodeList[0].type, 'prop');
            assert.equal(objectNode.childNodeList[0].propName, 'a');
            assert.equal(objectNode.childNodeList[0].childNodeList[0].type, 'value');
            assert.equal(objectNode.childNodeList[0].childNodeList[0].value.type, 'number');
            assert.equal(objectNode.childNodeList[0].childNodeList[0].value.tokens[0].getText(), '1');
            assert.equal(objectNode.childNodeList[1].type, 'prop');
            assert.equal(objectNode.childNodeList[1].propName, 'b');
            assert.equal(objectNode.childNodeList[1].childNodeList[0].type, 'value');
            assert.equal(objectNode.childNodeList[1].childNodeList[0].value.type, 'number');
            assert.equal(objectNode.childNodeList[1].childNodeList[0].value.tokens[0].getText(), '2');
            assert.equal(objectNode.childNodeList[2].type, 'prop');
            assert.equal(objectNode.childNodeList[2].propName, 'c');
            assert.equal(objectNode.childNodeList[2].childNodeList[0].type, 'value');
            assert.equal(objectNode.childNodeList[2].childNodeList[0].value.type, 'number');
            assert.equal(objectNode.childNodeList[2].childNodeList[0].value.tokens[0].getText(), '3');
        });

        it('test output result', function () {
            let jsonGet = parse(json);
            assert.equal(JSON.stringify(JSON.parse(json)), JSON.stringify(jsonGet));
        });
    });

    describe('test more complex cases:', function() {
        it('test yastjson output result', function () {
            const json = JSON.stringify({
                complex1: [
                    1,2,3,4
                ],
                complex2: {
                    p1: null,
                    p2: false,
                    p3: 'false',
                    p4: 123,
                    p5: -125,
                    p6: 3.141592653589793238462643
                }
            });
            let jsonGet = parse(json);
            assert.equal(json, JSON.stringify(jsonGet));
        });
        it('test yastjson output result', function () {
            const json = JSON.stringify({
                complex1: [
                    {
                        a: -1
                    },
                    2,
                    {
                        b: false
                    },
                    null,
                    {
                        c: 'xyz'
                    }
                ]
            });
            let jsonGet = parse(json);
            assert.equal(json, JSON.stringify(jsonGet));
        });
        it('test yastjson output result', function () {
            const json = '{"a":     1, "b 2": 2,"c":                 "efg"                   }';
            let jsonGet = parse(json);
            assert.equal(JSON.stringify(JSON.parse(json)), JSON.stringify(jsonGet));
        });
        it('test yastjson output result', function () {
            const json = '{"a": -1, "b": 124, "c": -0.1111111, "d":-11111111111, "e":0 }';
            let jsonGet = parse(json);
            assert.equal(JSON.stringify(JSON.parse(json)), JSON.stringify(jsonGet));
        });
        it('test yastjson output result', function () {
            const json = '{"empty_obj":{},"empty_arr":[]}';
            let jsonGet = parse(json);
            assert.equal(JSON.stringify(JSON.parse(json)), JSON.stringify(jsonGet));
        });
    });
});