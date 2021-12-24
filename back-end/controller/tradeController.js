/* Trade is caching per day: 2 days
 *  - yesterday: for quick review and reference
 *  - today: for fast retrieve of key/ importance information
 */

let cache = {
    order: {},
    trade: {},
    thought: {},
}