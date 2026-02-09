import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{S as g}from"./UserMenu-zY8MeJtX.js";import"./SectionTitle-OUIKQWJq.js";import"./index-BCtMShv3.js";import"./search-De7yGF5O.js";import"./createLucideIcon-CJ_m3CD5.js";const k={title:"Patterns/SearchField",component:g,tags:["autodocs"],parameters:{layout:"centered",docs:{description:{component:"Search field from Figma 303-4652. Default: no section hovered; dividers visible. Hover states: hovering Where, Era, or Who shows 8% black overlay and hides the adjacent divider(s). Use pinnedHoverSection in Storybook to show each hover state."}}},decorators:[W=>s.jsx("div",{style:{padding:"var(--ds-spacing-12) 0 var(--ds-spacing-32)",width:851},children:s.jsx(W,{})})],argTypes:{pinnedHoverSection:{control:"radio",options:[void 0,"where","era","who"]},onWhereClick:{action:"whereClicked"},onEraClick:{action:"eraClicked"},onWhoClick:{action:"whoClicked"},onSearch:{action:"searchClicked"}}},e={args:{},parameters:{docs:{description:{story:"Default: no section hovered; both dividers visible. Hover over a section to see overlay and divider hide."}}}},r={args:{pinnedHoverSection:"where"},parameters:{docs:{description:{story:"Where hover state: overlay on Where, divider after Where hidden."}}}},o={args:{pinnedHoverSection:"era"},parameters:{docs:{description:{story:"Era hover state: overlay on Era, both dividers hidden."}}}},a={args:{pinnedHoverSection:"who"},parameters:{docs:{description:{story:"Who hover state: overlay on Who, divider before Who hidden."}}}};var n,t,i;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default: no section hovered; both dividers visible. Hover over a section to see overlay and divider hide.'
      }
    }
  }
}`,...(i=(t=e.parameters)==null?void 0:t.docs)==null?void 0:i.source}}};var d,c,h;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    pinnedHoverSection: 'where'
  },
  parameters: {
    docs: {
      description: {
        story: 'Where hover state: overlay on Where, divider after Where hidden.'
      }
    }
  }
}`,...(h=(c=r.parameters)==null?void 0:c.docs)==null?void 0:h.source}}};var p,v,m;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    pinnedHoverSection: 'era'
  },
  parameters: {
    docs: {
      description: {
        story: 'Era hover state: overlay on Era, both dividers hidden.'
      }
    }
  }
}`,...(m=(v=o.parameters)==null?void 0:v.docs)==null?void 0:m.source}}};var l,u,y;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    pinnedHoverSection: 'who'
  },
  parameters: {
    docs: {
      description: {
        story: 'Who hover state: overlay on Who, divider before Who hidden.'
      }
    }
  }
}`,...(y=(u=a.parameters)==null?void 0:u.docs)==null?void 0:y.source}}};const C=["Default","WhereHover","EraHover","WhoHover"];export{e as Default,o as EraHover,r as WhereHover,a as WhoHover,C as __namedExportsOrder,k as default};
