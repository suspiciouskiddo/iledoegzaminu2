
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/App.svelte generated by Svelte v3.48.0 */

    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div4;
    	let div0;
    	let a0;
    	let h20;
    	let t1;
    	let p0;
    	let t3;
    	let h30;
    	let t5;
    	let div1;
    	let a1;
    	let h21;
    	let t7;
    	let p1;
    	let t9;
    	let h31;
    	let t11;
    	let div2;
    	let a2;
    	let h22;
    	let t13;
    	let p2;
    	let t15;
    	let h32;
    	let t16;
    	let t17;
    	let t18;
    	let h33;
    	let t19;
    	let t20;
    	let t21;
    	let h34;
    	let t22;
    	let t23;
    	let t24;
    	let h35;
    	let t25;
    	let t26;
    	let t27;
    	let div3;
    	let h23;
    	let t29;
    	let a3;
    	let p3;
    	let t31;
    	let input0;
    	let t32;
    	let input1;
    	let t33;
    	let input2;
    	let t34;
    	let a4;
    	let t35;
    	let t36;
    	let t37;
    	let t38;
    	let t39;
    	let t40;
    	let a4_href_value;
    	let t41;
    	let div14;
    	let ul;
    	let li0;
    	let a5;
    	let div6;
    	let svg0;
    	let path0;
    	let t42;
    	let div5;
    	let span0;
    	let t44;
    	let li1;
    	let div7;
    	let t45;
    	let li2;
    	let a6;
    	let div9;
    	let svg1;
    	let path1;
    	let t46;
    	let div8;
    	let span1;
    	let t48;
    	let li3;
    	let a7;
    	let div11;
    	let svg2;
    	let path2;
    	let t49;
    	let div10;
    	let span2;
    	let t51;
    	let li4;
    	let a8;
    	let div13;
    	let svg3;
    	let path3;
    	let t52;
    	let div12;
    	let span3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div4 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			h20 = element("h2");
    			h20.textContent = "Odliczanie do egzaminu ósmoklasisty 2023";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Kliknij w tekst aby zobaczyć więcej";
    			t3 = space();
    			h30 = element("h3");
    			h30.textContent = "Brak dokładnego terminu";
    			t5 = space();
    			div1 = element("div");
    			a1 = element("a");
    			h21 = element("h2");
    			h21.textContent = "Odliczanie do matury 2023";
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "Kliknij w tekst aby zobaczyć więcej";
    			t9 = space();
    			h31 = element("h3");
    			h31.textContent = "Brak dokładnego terminu";
    			t11 = space();
    			div2 = element("div");
    			a2 = element("a");
    			h22 = element("h2");
    			h22.textContent = "Odliczanie do końca wakacji";
    			t13 = space();
    			p2 = element("p");
    			p2.textContent = "Kliknij w tekst aby zobaczyć więcej";
    			t15 = space();
    			h32 = element("h3");
    			t16 = text("W dniach ");
    			t17 = text(/*wdays*/ ctx[0]);
    			t18 = space();
    			h33 = element("h3");
    			t19 = text("W godzinach ");
    			t20 = text(/*whours*/ ctx[1]);
    			t21 = space();
    			h34 = element("h3");
    			t22 = text("W minutach ");
    			t23 = text(/*wminutes*/ ctx[2]);
    			t24 = space();
    			h35 = element("h3");
    			t25 = text("W sekundach ");
    			t26 = text(/*wseconds*/ ctx[3]);
    			t27 = space();
    			div3 = element("div");
    			h23 = element("h2");
    			h23.textContent = "Generowanie własnego odliczania";
    			t29 = space();
    			a3 = element("a");
    			p3 = element("p");
    			p3.textContent = "Aby zapisać odliczanie kliknij tutaj";
    			t31 = space();
    			input0 = element("input");
    			t32 = space();
    			input1 = element("input");
    			t33 = space();
    			input2 = element("input");
    			t34 = space();
    			a4 = element("a");
    			t35 = text("https://iledoegzaminu.pl/custom?name=");
    			t36 = text(/*formname*/ ctx[5]);
    			t37 = text("&date=");
    			t38 = text(/*formdate*/ ctx[4]);
    			t39 = text("&time=");
    			t40 = text(/*formtime*/ ctx[6]);
    			t41 = space();
    			div14 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a5 = element("a");
    			div6 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t42 = space();
    			div5 = element("div");
    			span0 = element("span");
    			span0.textContent = "ILEDOEGZAMINU.PL";
    			t44 = space();
    			li1 = element("li");
    			div7 = element("div");
    			t45 = space();
    			li2 = element("li");
    			a6 = element("a");
    			div9 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t46 = space();
    			div8 = element("div");
    			span1 = element("span");
    			span1.textContent = "MATURA";
    			t48 = space();
    			li3 = element("li");
    			a7 = element("a");
    			div11 = element("div");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t49 = space();
    			div10 = element("div");
    			span2 = element("span");
    			span2.textContent = "EGZAMIN ÓSMOKLASISTY";
    			t51 = space();
    			li4 = element("li");
    			a8 = element("a");
    			div13 = element("div");
    			svg3 = svg_element("svg");
    			path3 = svg_element("path");
    			t52 = space();
    			div12 = element("div");
    			span3 = element("span");
    			span3.textContent = "WAKACJE 2023";
    			add_location(h20, file, 51, 62, 1599);
    			set_style(p0, "font-size", "12px");
    			add_location(p0, file, 52, 2, 1651);
    			add_location(h30, file, 59, 2, 1870);
    			attr_dev(a0, "href", "/e8");
    			set_style(a0, "color", "black");
    			add_location(a0, file, 51, 26, 1563);
    			attr_dev(div0, "class", "counterdiv svelte-wbgs4m");
    			add_location(div0, file, 51, 2, 1539);
    			add_location(h21, file, 61, 66, 1982);
    			set_style(p1, "font-size", "12px");
    			add_location(p1, file, 62, 3, 2020);
    			add_location(h31, file, 68, 3, 2238);
    			attr_dev(a1, "href", "/matura");
    			set_style(a1, "color", "black");
    			add_location(a1, file, 61, 26, 1942);
    			attr_dev(div1, "class", "counterdiv svelte-wbgs4m");
    			add_location(div1, file, 61, 2, 1918);
    			add_location(h22, file, 70, 68, 2353);
    			set_style(p2, "font-size", "12px");
    			add_location(p2, file, 71, 4, 2394);
    			add_location(h32, file, 72, 5, 2467);
    			add_location(h33, file, 73, 5, 2498);
    			add_location(h34, file, 74, 5, 2533);
    			add_location(h35, file, 75, 5, 2569);
    			attr_dev(a2, "href", "/wakacje");
    			set_style(a2, "color", "black");
    			add_location(a2, file, 70, 27, 2312);
    			attr_dev(div2, "class", "counterdiv svelte-wbgs4m");
    			add_location(div2, file, 70, 3, 2288);
    			add_location(h23, file, 78, 5, 2650);
    			set_style(p3, "font-size", "12px");
    			add_location(p3, file, 79, 49, 2740);
    			attr_dev(a3, "href", "/customsave");
    			set_style(a3, "color", "black");
    			add_location(a3, file, 79, 5, 2696);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Nazwa odliczania (bez znaków specjalnych)");
    			attr_dev(input0, "class", "svelte-wbgs4m");
    			add_location(input0, file, 80, 5, 2818);
    			attr_dev(input1, "type", "date");
    			attr_dev(input1, "id", "inputcustomdate");
    			attr_dev(input1, "class", "svelte-wbgs4m");
    			add_location(input1, file, 81, 5, 2921);
    			attr_dev(input2, "type", "time");
    			attr_dev(input2, "id", "inputcustomtime");
    			attr_dev(input2, "class", "svelte-wbgs4m");
    			add_location(input2, file, 82, 5, 2989);
    			attr_dev(a4, "href", a4_href_value = "/custom?name=" + /*formname*/ ctx[5] + "&date=" + /*formdate*/ ctx[4] + "&time=" + /*formtime*/ ctx[6]);
    			set_style(a4, "font-size", "14px");
    			add_location(a4, file, 83, 5, 3057);
    			attr_dev(div3, "class", "maeformdiv svelte-wbgs4m");
    			add_location(div3, file, 77, 4, 2620);
    			attr_dev(div4, "class", "counter-holder svelte-wbgs4m");
    			attr_dev(div4, "id", "counter-holder");
    			add_location(div4, file, 50, 1, 1488);
    			add_location(main, file, 49, 0, 1480);
    			attr_dev(path0, "d", "M352 0C369.7 0 384 14.33 384 32C384 49.67 369.7 64 352 64V74.98C352 117.4 335.1 158.1 305.1 188.1L237.3 256L305.1 323.9C335.1 353.9 352 394.6 352 437V448C369.7 448 384 462.3 384 480C384 497.7 369.7 512 352 512H32C14.33 512 0 497.7 0 480C0 462.3 14.33 448 32 448V437C32 394.6 48.86 353.9 78.86 323.9L146.7 256L78.86 188.1C48.86 158.1 32 117.4 32 74.98V64C14.33 64 0 49.67 0 32C0 14.33 14.33 0 32 0H352zM111.1 128H272C282.4 112.4 288 93.98 288 74.98V64H96V74.98C96 93.98 101.6 112.4 111.1 128zM111.1 384H272C268.5 378.7 264.5 373.7 259.9 369.1L192 301.3L124.1 369.1C119.5 373.7 115.5 378.7 111.1 384V384z");
    			add_location(path0, file, 96, 175, 3648);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 384 512");
    			attr_dev(svg0, "class", "svg-li-icon svelte-wbgs4m");
    			add_location(svg0, file, 92, 5, 3373);
    			add_location(span0, file, 101, 6, 4323);
    			attr_dev(div5, "class", "nav-text svelte-wbgs4m");
    			add_location(div5, file, 100, 5, 4294);
    			attr_dev(div6, "class", "nav-item-div svelte-wbgs4m");
    			add_location(div6, file, 91, 4, 3341);
    			attr_dev(a5, "href", "/");
    			set_style(a5, "text-decoration", "none");
    			add_location(a5, file, 90, 3, 3293);
    			attr_dev(li0, "class", "svelte-wbgs4m");
    			add_location(li0, file, 89, 2, 3285);
    			set_style(div7, "height", "50px");
    			add_location(div7, file, 107, 3, 4402);
    			attr_dev(li1, "class", "svelte-wbgs4m");
    			add_location(li1, file, 106, 2, 4394);
    			attr_dev(path1, "d", "M0 219.2v212.5c0 14.25 11.62 26.25 26.5 27C75.32 461.2 180.2 471.3 240 511.9V245.2C181.4 205.5 79.99 194.8 29.84 192C13.59 191.1 0 203.6 0 219.2zM482.2 192c-50.09 2.848-151.3 13.47-209.1 53.09C272.1 245.2 272 245.3 272 245.5v266.5c60.04-40.39 164.7-50.76 213.5-53.28C500.4 457.9 512 445.9 512 431.7V219.2C512 203.6 498.4 191.1 482.2 192zM352 96c0-53-43-96-96-96S160 43 160 96s43 96 96 96S352 149 352 96z");
    			add_location(path1, file, 116, 175, 4780);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 512 512");
    			attr_dev(svg1, "class", "svg-li-icon svelte-wbgs4m");
    			add_location(svg1, file, 112, 5, 4505);
    			add_location(span1, file, 121, 6, 5256);
    			attr_dev(div8, "class", "nav-text svelte-wbgs4m");
    			add_location(div8, file, 120, 5, 5227);
    			attr_dev(div9, "class", "nav-item-div svelte-wbgs4m");
    			add_location(div9, file, 111, 4, 4473);
    			attr_dev(a6, "href", "/matura");
    			add_location(a6, file, 110, 3, 4450);
    			attr_dev(li2, "class", "svelte-wbgs4m");
    			add_location(li2, file, 109, 2, 4442);
    			attr_dev(path2, "d", "M448 336v-288C448 21.49 426.5 0 400 0H96C42.98 0 0 42.98 0 96v320c0 53.02 42.98 96 96 96h320c17.67 0 32-14.33 32-31.1c0-11.72-6.607-21.52-16-27.1v-81.36C441.8 362.8 448 350.2 448 336zM143.1 128h192C344.8 128 352 135.2 352 144C352 152.8 344.8 160 336 160H143.1C135.2 160 128 152.8 128 144C128 135.2 135.2 128 143.1 128zM143.1 192h192C344.8 192 352 199.2 352 208C352 216.8 344.8 224 336 224H143.1C135.2 224 128 216.8 128 208C128 199.2 135.2 192 143.1 192zM384 448H96c-17.67 0-32-14.33-32-32c0-17.67 14.33-32 32-32h288V448z");
    			add_location(path2, file, 133, 175, 5651);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 448 512");
    			attr_dev(svg2, "class", "svg-li-icon svelte-wbgs4m");
    			add_location(svg2, file, 129, 5, 5376);
    			add_location(span2, file, 138, 6, 6244);
    			attr_dev(div10, "class", "nav-text svelte-wbgs4m");
    			add_location(div10, file, 137, 5, 6215);
    			attr_dev(div11, "class", "nav-item-div svelte-wbgs4m");
    			add_location(div11, file, 128, 4, 5344);
    			attr_dev(a7, "href", "/e8");
    			add_location(a7, file, 127, 3, 5325);
    			attr_dev(li3, "class", "svelte-wbgs4m");
    			add_location(li3, file, 126, 2, 5317);
    			attr_dev(path3, "d", "M115.4 136.8l102.1 37.35c35.13-81.62 86.25-144.4 139-173.7c-95.88-4.875-188.8 36.96-248.5 111.7C101.2 120.6 105.2 133.2 115.4 136.8zM247.6 185l238.5 86.87c35.75-121.4 18.62-231.6-42.63-253.9c-7.375-2.625-15.12-4.062-23.12-4.062C362.4 13.88 292.1 83.13 247.6 185zM521.5 60.51c6.25 16.25 10.75 34.62 13.13 55.25c5.75 49.87-1.376 108.1-18.88 166.9l102.6 37.37c10.13 3.75 21.25-3.375 21.5-14.12C642.3 210.1 598 118.4 521.5 60.51zM528 448h-207l65-178.5l-60.13-21.87l-72.88 200.4H48C21.49 448 0 469.5 0 496C0 504.8 7.163 512 16 512h544c8.837 0 16-7.163 16-15.1C576 469.5 554.5 448 528 448z");
    			add_location(path3, file, 150, 175, 6658);
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "viewBox", "0 0 640 512");
    			attr_dev(svg3, "class", "svg-li-icon svelte-wbgs4m");
    			add_location(svg3, file, 146, 5, 6383);
    			add_location(span3, file, 155, 6, 7314);
    			attr_dev(div12, "class", "nav-text svelte-wbgs4m");
    			add_location(div12, file, 154, 5, 7285);
    			attr_dev(div13, "class", "nav-item-div svelte-wbgs4m");
    			add_location(div13, file, 145, 4, 6351);
    			attr_dev(a8, "href", "/wakacje");
    			add_location(a8, file, 144, 3, 6327);
    			attr_dev(li4, "class", "svelte-wbgs4m");
    			add_location(li4, file, 143, 2, 6319);
    			attr_dev(ul, "class", "svelte-wbgs4m");
    			add_location(ul, file, 88, 1, 3278);
    			attr_dev(div14, "class", "nav svelte-wbgs4m");
    			add_location(div14, file, 87, 0, 3259);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div4);
    			append_dev(div4, div0);
    			append_dev(div0, a0);
    			append_dev(a0, h20);
    			append_dev(a0, t1);
    			append_dev(a0, p0);
    			append_dev(a0, t3);
    			append_dev(a0, h30);
    			append_dev(div4, t5);
    			append_dev(div4, div1);
    			append_dev(div1, a1);
    			append_dev(a1, h21);
    			append_dev(a1, t7);
    			append_dev(a1, p1);
    			append_dev(a1, t9);
    			append_dev(a1, h31);
    			append_dev(div4, t11);
    			append_dev(div4, div2);
    			append_dev(div2, a2);
    			append_dev(a2, h22);
    			append_dev(a2, t13);
    			append_dev(a2, p2);
    			append_dev(a2, t15);
    			append_dev(a2, h32);
    			append_dev(h32, t16);
    			append_dev(h32, t17);
    			append_dev(a2, t18);
    			append_dev(a2, h33);
    			append_dev(h33, t19);
    			append_dev(h33, t20);
    			append_dev(a2, t21);
    			append_dev(a2, h34);
    			append_dev(h34, t22);
    			append_dev(h34, t23);
    			append_dev(a2, t24);
    			append_dev(a2, h35);
    			append_dev(h35, t25);
    			append_dev(h35, t26);
    			append_dev(div4, t27);
    			append_dev(div4, div3);
    			append_dev(div3, h23);
    			append_dev(div3, t29);
    			append_dev(div3, a3);
    			append_dev(a3, p3);
    			append_dev(div3, t31);
    			append_dev(div3, input0);
    			set_input_value(input0, /*formname*/ ctx[5]);
    			append_dev(div3, t32);
    			append_dev(div3, input1);
    			set_input_value(input1, /*formdate*/ ctx[4]);
    			append_dev(div3, t33);
    			append_dev(div3, input2);
    			set_input_value(input2, /*formtime*/ ctx[6]);
    			append_dev(div3, t34);
    			append_dev(div3, a4);
    			append_dev(a4, t35);
    			append_dev(a4, t36);
    			append_dev(a4, t37);
    			append_dev(a4, t38);
    			append_dev(a4, t39);
    			append_dev(a4, t40);
    			insert_dev(target, t41, anchor);
    			insert_dev(target, div14, anchor);
    			append_dev(div14, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a5);
    			append_dev(a5, div6);
    			append_dev(div6, svg0);
    			append_dev(svg0, path0);
    			append_dev(div6, t42);
    			append_dev(div6, div5);
    			append_dev(div5, span0);
    			append_dev(ul, t44);
    			append_dev(ul, li1);
    			append_dev(li1, div7);
    			append_dev(ul, t45);
    			append_dev(ul, li2);
    			append_dev(li2, a6);
    			append_dev(a6, div9);
    			append_dev(div9, svg1);
    			append_dev(svg1, path1);
    			append_dev(div9, t46);
    			append_dev(div9, div8);
    			append_dev(div8, span1);
    			append_dev(ul, t48);
    			append_dev(ul, li3);
    			append_dev(li3, a7);
    			append_dev(a7, div11);
    			append_dev(div11, svg2);
    			append_dev(svg2, path2);
    			append_dev(div11, t49);
    			append_dev(div11, div10);
    			append_dev(div10, span2);
    			append_dev(ul, t51);
    			append_dev(ul, li4);
    			append_dev(li4, a8);
    			append_dev(a8, div13);
    			append_dev(div13, svg3);
    			append_dev(svg3, path3);
    			append_dev(div13, t52);
    			append_dev(div13, div12);
    			append_dev(div12, span3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[7]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[8]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[9])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*wdays*/ 1) set_data_dev(t17, /*wdays*/ ctx[0]);
    			if (dirty & /*whours*/ 2) set_data_dev(t20, /*whours*/ ctx[1]);
    			if (dirty & /*wminutes*/ 4) set_data_dev(t23, /*wminutes*/ ctx[2]);
    			if (dirty & /*wseconds*/ 8) set_data_dev(t26, /*wseconds*/ ctx[3]);

    			if (dirty & /*formname*/ 32 && input0.value !== /*formname*/ ctx[5]) {
    				set_input_value(input0, /*formname*/ ctx[5]);
    			}

    			if (dirty & /*formdate*/ 16) {
    				set_input_value(input1, /*formdate*/ ctx[4]);
    			}

    			if (dirty & /*formtime*/ 64) {
    				set_input_value(input2, /*formtime*/ ctx[6]);
    			}

    			if (dirty & /*formname*/ 32) set_data_dev(t36, /*formname*/ ctx[5]);
    			if (dirty & /*formdate*/ 16) set_data_dev(t38, /*formdate*/ ctx[4]);
    			if (dirty & /*formtime*/ 64) set_data_dev(t40, /*formtime*/ ctx[6]);

    			if (dirty & /*formname, formdate, formtime*/ 112 && a4_href_value !== (a4_href_value = "/custom?name=" + /*formname*/ ctx[5] + "&date=" + /*formdate*/ ctx[4] + "&time=" + /*formtime*/ ctx[6])) {
    				attr_dev(a4, "href", a4_href_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (detaching) detach_dev(t41);
    			if (detaching) detach_dev(div14);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const e8date = new Date(2023, 6, 1, 8, 0, 0);
    	const mdate = new Date(2023, 3, 1, 1, 12, 0);
    	const wakacjedate = new Date(2022, 8, 1, 8, 0, 0);
    	let e8days = undefined;
    	let e8hours = undefined;
    	let e8minutes = undefined;
    	let e8seconds = undefined;
    	let mdays = undefined;
    	let mhours = undefined;
    	let mminutes = undefined;
    	let mseconds = undefined;
    	let wdays = undefined;
    	let whours = undefined;
    	let wminutes = undefined;
    	let wseconds = undefined;
    	let formdate = "";
    	let formname = "";
    	let formtime = "";

    	function calcDate() {
    		const now = new Date();
    		const diff = e8date - now;
    		const diffmatura = mdate - now;
    		const diffwakacje = wakacjedate - now;
    		e8days = Math.floor(diff / (1000 * 60 * 60 * 24) * 10000) / 10000;
    		e8hours = Math.floor(diff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
    		e8minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
    		e8seconds = Math.floor(diff % (1000 * 60) / 1000);
    		mdays = Math.floor(diffmatura / (1000 * 60 * 60 * 24));
    		mhours = Math.floor(diffmatura % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
    		mminutes = Math.floor(diffmatura % (1000 * 60 * 60) / (1000 * 60));
    		mseconds = Math.floor(diffmatura % (1000 * 60) / 1000);
    		$$invalidate(0, wdays = Math.floor(diffwakacje / (1000 * 60 * 60 * 24) * 10000) / 10000);
    		$$invalidate(1, whours = Math.floor(diffwakacje / (1000 * 60 * 60) * 1000) / 1000);
    		$$invalidate(2, wminutes = Math.floor(diffwakacje / (1000 * 60) * 100) / 100);
    		$$invalidate(3, wseconds = Math.floor(diffwakacje / 1000));
    	}

    	setInterval(calcDate, 500);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		formname = this.value;
    		$$invalidate(5, formname);
    	}

    	function input1_input_handler() {
    		formdate = this.value;
    		$$invalidate(4, formdate);
    	}

    	function input2_input_handler() {
    		formtime = this.value;
    		$$invalidate(6, formtime);
    	}

    	$$self.$capture_state = () => ({
    		e8date,
    		mdate,
    		wakacjedate,
    		e8days,
    		e8hours,
    		e8minutes,
    		e8seconds,
    		mdays,
    		mhours,
    		mminutes,
    		mseconds,
    		wdays,
    		whours,
    		wminutes,
    		wseconds,
    		formdate,
    		formname,
    		formtime,
    		calcDate
    	});

    	$$self.$inject_state = $$props => {
    		if ('e8days' in $$props) e8days = $$props.e8days;
    		if ('e8hours' in $$props) e8hours = $$props.e8hours;
    		if ('e8minutes' in $$props) e8minutes = $$props.e8minutes;
    		if ('e8seconds' in $$props) e8seconds = $$props.e8seconds;
    		if ('mdays' in $$props) mdays = $$props.mdays;
    		if ('mhours' in $$props) mhours = $$props.mhours;
    		if ('mminutes' in $$props) mminutes = $$props.mminutes;
    		if ('mseconds' in $$props) mseconds = $$props.mseconds;
    		if ('wdays' in $$props) $$invalidate(0, wdays = $$props.wdays);
    		if ('whours' in $$props) $$invalidate(1, whours = $$props.whours);
    		if ('wminutes' in $$props) $$invalidate(2, wminutes = $$props.wminutes);
    		if ('wseconds' in $$props) $$invalidate(3, wseconds = $$props.wseconds);
    		if ('formdate' in $$props) $$invalidate(4, formdate = $$props.formdate);
    		if ('formname' in $$props) $$invalidate(5, formname = $$props.formname);
    		if ('formtime' in $$props) $$invalidate(6, formtime = $$props.formtime);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		wdays,
    		whours,
    		wminutes,
    		wseconds,
    		formdate,
    		formname,
    		formtime,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
