One-line: Settings dropdown — always give it a `hint` stating the consequence of the choice.

```jsx
<Select label="Earning mode" value={mode} onChange={setMode}
  options={['Visits only', 'Bill amount', 'Visits with a minimum bill']}
  hint="1 visit = 1 stamp. Staff won't be asked for a bill total." />
```
