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
const Tokenizer = require('./tokenizer');
const { AST } = require('./ast');
const ExprType = require('./expression').ExprType;
const TokenType = require('./token').TokenType;

class ASTParser {
    constructor(ast) {
        this.ast = ast;
    }

    getJson() {
        let outputJson = this.handleJson(this.ast);
        return outputJson;
    }

    handleJson(astNode) {
        if (astNode.type !== ExprType.Json) {
            throw new Error('[parse AST error] unexpected node type, expect Json');
        }

        let output;
        let node = astNode.childNodeList[0];
        if (node.type === ExprType.Array) {
            output = [];
            for (let item of node.childNodeList) {
                if (item.type === ExprType.Value) {
                    let value = this.handleValue(item.value);
                    output.push(value);
                }
                else {
                    throw new Error('[parse AST error] unexpected node type, expect Value');
                }
            }
        }
        else if (node.type === ExprType.Object) {
            output = {};
            for (let item of node.childNodeList) {
                if (item.type === ExprType.Prop) {
                    let prop = item.propName;
                    if (item.childNodeList[0].type !== ExprType.Value) {
                        throw new Error('[parse AST error] unexpected node type, expect Value');
                    }
                    let value = this.handleValue(item.childNodeList[0].value);
                    output[prop] = value;
                }
                else {
                    throw new Error('[parse AST error] unexpected node type, expect Prop');
                }
            }
        }
        else {
            throw new Error('[parse AST error] unexpected second node type');
        }
        return output;
    }

    handleValue(astNode) {
        let token;
        switch (astNode.type) {
            case TokenType.Null:
                return null;
            case TokenType.Boolean:
                token = astNode.tokens[0].getText();
                if (token === 'true') {
                    return true;
                }
                else if (token === 'false') {
                    return false;
                }
                else {
                    throw new Error('[parse AST error] unexpected boolean node value');
                }
            case TokenType.Number:
                token = astNode.tokens[0].getText();
                try {
                    let num = parseFloat(token);
                    if (isNaN(num)) {
                        throw new Error('[parse AST error] unexpected number node value');
                    }
                    return num;
                }
                catch (err) {
                    throw new Error('[parse AST error] unexpected number node value');
                }
            case TokenType.String:
                token = astNode.tokens[0].getText();
                return token.slice(1, token.length - 1);
            case ExprType.Json:
                return this.handleJson(astNode);
            default:
                throw new Error('[parse AST error] unexpected node type, expect a valid Value node');
        }
    }
}

function parse(jsonString) {
    const tokenizer = new Tokenizer();
    const tokens = tokenizer.tokenize(jsonString);
    const astInst = new AST(tokens);
    const ast = astInst.buildTree();
    const astParser = new ASTParser(ast);
    return astParser.getJson();
}

module.exports = {
    ASTParser,
    parse
};