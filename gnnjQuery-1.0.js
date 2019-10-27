(function(window, undefined) {
    var gnnjQuery = function(selector) {
        return new gnnjQuery.prototype.init(selector);
    }
    gnnjQuery.prototype = {
        constructor: gnnjQuery,
        jquery: "1.1.0",
        selector: "",
        length: 0,
        //[].push找到数组的push
        //前面的push由gnnjQuery调用
        //相当于 [].push.apply(this)
        push: [].push,
        sort: [].sort,
        splice: [].splice,
        toArray: function() {
            return [].slice.call(this);
        },
        get: function(num) {
            if (arguments.length === 0) {
                return this.toArray();
            }
            //传递不是负数
            else if (num >= 0) {
                return this[num];
            }
            //传递负数
            else {
                return this[this.length + num];
            }
        },
        eq: function(num) {
            //没有参数
            if (arguments.length === 0) {
                return new gnnjQuery();
            } else {
                return gnnjQuery(this.get(num));
            }
            // //传递不是负数
            // else if (num >= 0) {
            //     return gnnjQuery(this.get(num));
            // }
            // //传递负数
            // else {
            //     return gnnjQuery(this.get(num));
            // }
        },
        first: function() {
            return this.eq(0);
        },
        last: function() {
            return this.eq(-1);
        },
        each: function(fn) {
            return gnnjQuery.each(this, fn);
        },
        init: function(selector) {
            //总结：
            //1.传入 "" null undefined NaN 0 false 返回空的jQuery对象
            //2.字符串：
            //代码片段：会将创建好的DOM元素存储到jQuery对象中返回
            //选择器：会将找到的所有元素存储到jQuery对象中返回
            //3.数组：
            //真伪数组都一样：会将数组的中的元素依次存储到jQuery对象中返回
            //4.除上述类型以外：会将传入的数据存储到jQuery中返回


            //去除字符串前面空格
            selector = gnnjQuery.trim(selector);
            if (!selector) {

            }
            //方法处理
            else if (gnnjQuery.isFunction(selector)) {
                gnnjQuery.ready(selector);
            }
            //字符串
            else if (gnnjQuery.isString(selector)) {
                //字符串
                //判断是否是代码片段
                if (gnnjQuery.isHTML(selector)) {
                    //1.根据代码片段创建元素
                    var temp = document.createElement('div');
                    temp.innerHTML = selector;
                    /*
                    //2.将创建好的一级元素添加到jQuery中
                    for (var i = 0; i < temp.children.length; i++) {
                        this[i] = temp.children[i];
                    }
                    //3.给jQuery对象添加length属性
                    this.length = temp.children.length;
                    */
                    [].push.apply(this, temp.children);
                    //4.返回加工好的this(jQuery)

                }
                //传入的是选择器
                else {
                    //1.根据传入的选择器找到对应的元素
                    var res = document.querySelectorAll(selector);
                    //2.将找到的元素添加到gnnjQuery中
                    [].push.apply(this, res);
                    //3.返回加工的this

                }
            }
            //数组
            else if (gnnjQuery.isArray(selector)) {
                //数组
                // console.log('是数组');
                /*//真数组
                if (({}).toString.apply(selector) === "[object Array]") {
                    [].push.apply(this, selector);
                    return this;
                }
                //伪数组 
                else {
                    //将自定义伪数组，转真数组
                    var arr = [].slice.call(selector);
                    //将真数组转伪数组
                    [].push.apply(this, arr);
                    return this;
                }*/

                //将自定义伪数组，转真数组
                var arr = [].slice.call(selector);
                //将真数组转伪数组
                [].push.apply(this, arr);

            }
            //其他类型处理
            else {
                this[0] = selector;
                this.length = 1;

            }
            return this;
        }

    };
    gnnjQuery.extend = function(obj) {
        //这里的this是gnnjQuery
        for (var key in obj) {
            this[key] = obj[key];
        }
    };
    gnnjQuery.extend = gnnjQuery.prototype.extend = function(obj) {
        for (var key in obj) {
            this[key] = obj[key];
        }
    };
    //分类管理相同类型的方法
    //工具方法
    gnnjQuery.extend({
        //判断是不是字符串
        isString: function(str) {
            return typeof str === 'string'
        },
        //判断是不是代码片段
        isHTML: function(str) {

            return str.charAt(0) == '<' && str.charAt(str.length - 1) == '>' && str.length >= 3
        },
        //去除字符串前后空格
        trim: function(str) {
            if (!gnnjQuery.isString(str)) {
                return str;
            }
            //判断是否支持trim
            if (str.trim) {
                return str.trim();
            } else {
                return str.replace(/^\s+|\s+$/g, "");
            }
        },
        //判断是不是对象
        isObject: function(sele) {
            return typeof sele === 'object';
        },
        //判断是不是window
        isWindow: function(sele) {
            return sele === window;
        },
        //判断是不是数组
        isArray: function(sele) {
            if (gnnjQuery.isObject(sele) && !gnnjQuery.isWindow(sele) && 'length' in sele) {
                return true;
            }
            return false;
        },
        //判断是不是函数
        isFunction: function(sele) {
            return typeof sele === "function"
        },
        ready: function(fn) {
            //判断DOM是否加载完毕
            if (document.readyState === "complete") {
                fn();
            } else if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', function() {
                    fn();
                });
            } else {
                document.attachEvent('onreadystatechange', function() {
                    fn();
                });

            }
        },
        each: function(obj, fn) {
            //判断是否数组
            if (gnnjQuery.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    //将内部this改为当前value
                    var res = fn.call(obj[i], i, obj[i]);
                    if (res === true) {
                        continue;
                    } else if (res === false) {
                        break;
                    }
                }
            }
            //判断是不是对象
            else if (gnnjQuery.isObject(obj)) {
                for (var key in obj) {
                    // var res = fn(key, obj[key]);
                    var res = fn.call(obj[key], key, obj[key]);
                    if (res === true) {
                        continue;
                    } else if (res === false) {
                        break;
                    }
                }
            }
            return obj;
        },
        map: function(obj, fn) {
            var res = [];
            //判断是否数组
            if (gnnjQuery.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    //将内部this改为当前value
                    var temp = fn(obj[i], i);
                    if (temp) {
                        res.push(temp);
                    }


                }
            }
            //判断是不是对象
            else if (gnnjQuery.isObject(obj)) {
                for (var key in obj) {
                    var temp = fn(obj[key], key);
                    if (temp) {
                        res.push(temp);
                    }
                }
            }
            return res;
        },

        get_nextsibling: function(n) {
            var x = n.nextSibling;
            while (x != null && x.nodeType != 1) {
                x = x.nextSibling;
            }
            return x;
        },
        get_previoussibling: function(n) {
            var x = n.previousSibling;
            while (x != null && x.nodeType != 1) {
                x = x.previousSibling;
            }
            return x;
        },
        getStyle: function(dom, styleName) {
            if (window.getComputedStyle) {
                return window.getComputedStyle(dom)[styleName];
            } else {
                return dom.currentStyle[styleName];
            }
        },
        addEvent: function(dom, name, callback) {
            if (dom.addEventListener) {
                dom.addEventListener(name, callback);
            } else {
                dom.attachEvent("on" + name, callback);
            }
        }
    });
    //DOM相关方法
    gnnjQuery.prototype.extend({
        //清空元素
        empty: function() {
            //遍历所有找到的元素
            this.each(function(key, value) {
                value.innerHTML = "";
            });
            //为了方便链式编程
            return this;
        },
        remove: function(sele) {
            if (arguments.length === 0) {
                //遍历指定
                this.each(function(key, value) {
                    //根据的遍历到的元素找到父元素，删除指定元素
                    var parent = value.parentNode;
                    parent.removeChild(value);
                });

            } else {
                var $this = this;
                //根据选择器找到指定的元素
                $(sele).each(function(key, value) {
                    //遍历找到的元素，获取对应的类型
                    var temp = value.tagName;
                    //遍历的指定元素
                    $this.each(function(k, v) {
                        //获取指定元素的类型
                        var t = v.tagName;
                        //判断找到的元素的类型和指定元素的类型
                        if (t === temp) {
                            var parent = value.parentNode;
                            parent.removeChild(value);
                        }
                    });
                });
            }
            //为了方便链式编程
            return this;
        },
        html: function(content) {
            if (arguments.length === 0) {
                return this[0].innerHTML;
            } else {
                this.each(function(key, value) {
                    value.innerHTML = content;
                });
            }
        },
        text: function(content) {
            if (arguments.length === 0) {
                var res = " ";
                this.each(function(key, value) {
                    res += value.innerText;

                });
                return res;
            } else {
                this.each(function(key, value) {
                    value.innerText = content;
                });
            }
        },
        appendTo: function(sele) {
            //将传入数据的转换为核心函数
            var $target = $(sele);
            var $this = this;
            var res = [];
            $.each($target, function(key, value) {
                $this.each(function(k, v) {
                    if (key === 0) {
                        value.appendChild(v);
                        res.push(v);
                    } else {
                        //先克隆
                        var temp = v.cloneNode(true);
                        res.push(temp);
                        value.appendChild(temp);
                    }
                });
            });
            //返回所有添加的元素
            return $(res);

        },
        prependTo: function(sele) {
            //将传入数据的转换为核心函数
            var $target = $(sele);
            var $this = this;
            var res = [];
            $.each($target, function(key, value) {
                $this.each(function(k, v) {
                    if (key === 0) {
                        value.insertBefore(v, value.firstChild);
                        res.push(v);
                    } else {
                        //先克隆
                        var temp = v.cloneNode(true);
                        res.push(temp);
                        value.insertBefore(temp, value.firstChild);
                    }
                });
            });
            //返回所有添加的元素
            return $(res);
        },
        append: function(sele) {
            //判断传入参数是否为字符串
            if (gnnjQuery.isString(sele)) {
                this[0].innerHTML += sele;
            } else {
                $(sele).appendTo(this);
            }
            return this;
        },
        prepend: function(sele) {
            //判断传入参数是否为字符串
            if (gnnjQuery.isString(sele)) {
                this[0].innerHTML = sele + this[0].innerHTML;
            } else {
                $(sele).prependTo(this);
            }
            return this;
        },
        insertBefore: function(sele) {
            // 1.统一的将传入的数据转换为jQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            // 2.遍历取出所有指定的元素
            $.each($target, function(key, value) {
                var parent = value.parentNode;
                // 2.遍历取出所有的元素
                $this.each(function(k, v) {
                    // 3.判断当前是否是第0个指定的元素
                    if (key === 0) {
                        // 直接添加
                        parent.insertBefore(v, value);
                        res.push(v);
                    } else {
                        // 先拷贝再添加
                        var temp = v.cloneNode(true);
                        parent.insertBefore(temp, value);
                        res.push(temp);
                    }
                });
            });
            // 3.返回所有添加的元素
            return $(res);
        },
        insertAfter: function(sele) {
            // 1.统一的将传入的数据转换为jQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            // 2.遍历取出所有指定的元素
            $.each($target, function(key, value) {
                var parent = value.parentNode;
                var nextNode = $.get_nextsibling(value);
                // 2.遍历取出所有的元素
                $this.each(function(k, v) {
                    // 3.判断当前是否是第0个指定的元素
                    if (key === 0) {
                        // 直接添加
                        parent.insertBefore(v, nextNode);
                        res.push(v);
                    } else {
                        // 先拷贝再添加
                        var temp = v.cloneNode(true);
                        parent.insertBefore(temp, nextNode);
                        res.push(temp);
                    }
                });
            });
            // 3.返回所有添加的元素
            return $(res);
        },
        replaceAll: function(sele) {
            // 1.统一的将传入的数据转换为jQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            // 2.遍历取出所有指定的元素
            $.each($target, function(key, value) {
                var parent = value.parentNode;
                // 2.遍历取出所有的元素
                $this.each(function(k, v) {
                    // 3.判断当前是否是第0个指定的元素
                    if (key === 0) {
                        // 1.将元素插入到指定元素的前面
                        $(v).insertBefore(value);
                        // 2.将指定元素删除
                        $(value).remove();
                        res.push(v);
                    } else {
                        // 先拷贝再添加
                        var temp = v.cloneNode(true);
                        // 1.将元素插入到指定元素的前面
                        $(temp).insertBefore(value);
                        // 2.将指定元素删除
                        $(value).remove();
                        res.push(temp);
                    }
                });
            });
            // 3.返回所有添加的元素
            return $(res);
        },
        clone: function(deep) {
            var res = [];
            //判断深复制
            if (deep) {
                this.each(function(key, ele) {
                    var temp = ele.cloneNode(true);
                    //遍历元素中eventsCache
                    gnnjQuery.each(ele.eventsCache, function(name, array) {
                        //遍历事件对象的数组
                        gnnjQuery.each(array, function(index, method) {
                            //给复制的元素添加事件
                            $(temp).on(name, method);
                        });
                    });
                    res.push(temp);
                });
                return $(res);
            }
            //浅复制
            else {
                this.each(function(key, ele) {
                    var temp = ele.cloneNode(true);
                    res.push(temp);
                });
                return $(res);
            }
        }
    });
    // 筛选相关方法
    gnnjQuery.prototype.extend({
        next: function(sele) {
            var res = [];
            if (arguments.length === 0) {
                // 返回所有找到的
                this.each(function(key, value) {
                    var temp = gnnjQuery.get_nextsibling(value);
                    if (temp != null) {
                        res.push(temp);
                    }
                });
            } else {
                // 返回指定找到的
                this.each(function(key, value) {
                    var temp = gnnjQuery.get_nextsibling(value)
                    $(sele).each(function(k, v) {
                        if (v == null || v !== temp) return true;
                        res.push(v);
                    });
                });
            }
            return $(res);
        },
        prev: function(sele) {
            var res = [];
            if (arguments.length === 0) {
                this.each(function(key, value) {
                    var temp = gnnjQuery.get_previoussibling(value);
                    if (temp == null) return true;
                    res.push(temp);
                });
            } else {
                this.each(function(key, value) {
                    var temp = gnnjQuery.get_previoussibling(value);
                    $(sele).each(function(k, v) {
                        if (v == null || temp !== v) return true;
                        res.push(v);
                    })
                });
            }
            return $(res);
        }
    });

    //属性操作相关方法
    gnnjQuery.prototype.extend({
        attr: function(attr, value) {
            //判断是否是字符串
            if (gnnjQuery.isString(attr)) {
                //判断是一个字符串还是两个字符串
                if (arguments.length === 1) {
                    return this[0].getAttribute(attr);
                } else {
                    this.each(function(key, ele) {
                        ele.setAttribute(attr, value);
                    })
                }

            }
            //判断是否是对象
            else if (gnnjQuery.isObject(attr)) {
                var $this = this;
                //遍历取出所有属性的节点的名称和对应的值
                $.each(attr, function(key, value) {
                    //遍历所有的元素
                    $this.each(function(k, ele) {
                        ele.setAttribute(key, value);
                    })
                });
            }
            return this;
        },
        prop: function(attr, value) {
            //判断是否是字符串
            if (gnnjQuery.isString(attr)) {
                //判断是一个字符串还是两个字符串
                if (arguments.length === 1) {
                    return this[0][attr];
                } else {
                    this.each(function(key, ele) {
                        ele[attr] = value
                    })
                }

            }
            //判断是否是对象
            else if (gnnjQuery.isObject(attr)) {
                var $this = this;
                //遍历取出所有属性的节点的名称和对应的值
                $.each(attr, function(key, value) {
                    //遍历所有的元素
                    $this.each(function(k, ele) {
                        ele[key] = value;
                    })
                });
            }
            return this;
        },
        css: function(attr, value) {
            //判断是否是字符串
            if (gnnjQuery.isString(attr)) {
                //判断是一个字符串还是两个字符串
                if (arguments.length === 1) {
                    return gnnjQuery.getStyle(this[0], attr);
                } else {
                    this.each(function(key, ele) {
                        ele.style[attr] = value;
                    })
                }

            }
            //判断是否是对象
            else if (gnnjQuery.isObject(attr)) {
                var $this = this;
                //遍历取出所有属性的节点的名称和对应的值
                $.each(attr, function(key, value) {
                    //遍历所有的元素
                    $this.each(function(k, ele) {
                        ele.style[key] = value;
                    })
                });
            }
            return this;
        },
        val: function(content) {
            //判断有没有传参数
            if (arguments.length === 0) {
                return this[0].value;
            } else {
                this.each(function(key, ele) {
                    ele.value = content;
                });
                return this;
            }

        },
        hasClass: function(name) {
            var flag = false;
            if (arguments.length === 0) {
                return flag;
            } else {
                this.each(function(key, ele) {
                    //获取元素中class保存的值
                    var className = " " + ele.className + " ";
                    //给指定字符串前面加空格
                    name = " " + name + " ";
                    //通过indexof
                    if (className.indexOf(name) != -1) {

                        flag = true;
                        return false;
                    }
                });
                return flag;
            }

        },
        addClass: function(name) {
            if (arguments.length === 0) return this;
            //对传入的类名进行切割、
            var names = name.split(' ');
            //遍历取出的元素
            this.each(function(key, ele) {
                //遍历数组取出每一个类名
                $.each(names, function(k, v) {
                    //判断指定元素中是否包含指定类名
                    if (!$(ele).hasClass(v)) {
                        ele.className = ele.className + " " + v;
                    }
                });
            });
            return this;

        },
        removeClass: function(name) {
            if (arguments.length === 0) {
                this.each(function(key, ele) {
                    ele.className = "";
                });
            } else {
                //对传入的类名进行切割、
                var names = name.split(" ");
                //遍历取出的元素
                this.each(function(key, ele) {
                    //遍历数组取出每一个类名
                    $.each(names, function(k, v) {
                        //判断指定元素中是否包含指定类名
                        if ($(ele).hasClass(v)) {
                            ele.className = (" " + ele.className + " ").replace(" " + v + " ", " ");
                        }
                    });
                });
            }
            return this;
        },
        toggleClass: function(name) {
            if (arguments.length === 0) {
                this.removeClass();
            } else {
                //对传入的类名进行切割、
                var names = name.split(" ");
                //遍历取出的元素
                this.each(function(key, ele) {
                    //遍历数组取出每一个类名
                    $.each(names, function(k, v) {
                        //判断指定元素中是否包含指定类名
                        if ($(ele).hasClass(v)) {
                            $(ele).removeClass(v);
                        } else {
                            $(ele).addClass(v);
                        }
                    });
                });
            }
            return this;
        }
    });
    //事件操作相关的方法
    gnnjQuery.prototype.extend({
        on: function(name, callback) {
            // 1.遍历取出所有元素
            this.each(function(key, ele) {
                // 2.判断当前元素中是否有保存所有事件的对象
                if (!ele.eventsCache) {
                    ele.eventsCache = {};
                }
                // 3.判断对象中有没有对应类型的数组
                if (!ele.eventsCache[name]) {
                    ele.eventsCache[name] = [];
                    // 4.将回调函数添加到数据中
                    ele.eventsCache[name].push(callback);
                    // 5.添加对应类型的事件
                    gnnjQuery.addEvent(ele, name, function() {
                        gnnjQuery.each(ele.eventsCache[name], function(k, method) {
                            method.call(ele);
                        });
                    });
                } else {
                    // 6.将回调函数添加到数据中
                    ele.eventsCache[name].push(callback);
                }
            });
            return this;
        },
        off: function(name, callback) {
            //判断是否没有传入参数
            if (arguments.length === 0) {
                this.each(function(key, ele) {
                    ele.eventsCache = {};
                });
            }
            //判断是否传入了一个参数
            else if (arguments.length === 1) {
                this.each(function(key, ele) {
                    ele.eventsCache[name] = " ";
                });
            }
            //判断传入了两个参数
            else if (arguments.length === 2) {
                this.each(function(key, ele) {
                    gnnjQuery.each(ele.eventsCache[name], function(index, method) {
                        //判断遍历的方法和传入的方法是否相同
                        if (method === callback) {
                            ele.eventsCache[name].splice(index, 1);
                        }
                    })
                });
            }
            return this;
        }
    })


    gnnjQuery.prototype.init.prototype = gnnjQuery.prototype;
    window.gnnjQuery = window.$ = gnnjQuery;
})(window);