import React from 'react';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
//import profile from '../../../datasamples/profile_mosquito.json';
import correlation from '../../../datasamples/correlation_turla.json';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.caption,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


// eslint-disable-next-line
export default function ({ data }) {
  const [tactics, setTactics] = React.useState({});
  React.useEffect(() => {
    //console.log(`Profile: ${profile}`);
    if (correlation === undefined) return
    if (Object.keys(tactics).length === 0 || tactics === undefined) return
  // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (correlation === undefined) return
    const killChains = loadTactics();
    let temp = {};
    correlation.forEach(d => {
      Object.keys(temp).includes(d.tactic)
      ? temp[d.tactic].techniques.push({ tid: d.tid, technique: d.technique })
      : temp[d.tactic] = { techniques: [{tid: d.tid, technique: d.technique }] }
    });
    let threat = {};
    killChains.forEach(k => {
      if (Object.keys(temp).includes(k)) {
        threat[k] = temp[k]
      }
    });
    setTactics(() => threat)
  }, []);

  return (
    <div style={{ marginLeft: 0 }}>
      <hr />
        <div>
        <Grid container spacing={0.5}>
          {Object.keys(tactics).map(t => (
            <Tactic key={uuidv4()}
              name={t}
              techniques={tactics[t].techniques}
            />
          ))}
      </Grid>
        </div>
      <hr />
    </div>
  )
}

export const Tactic = ({ name, techniques}) => {
  const [count, setCount] = React.useState(0);
  
  React.useEffect(() => {
    if (count === undefined) return
    setCount(() => techniques.length)
  }, [count, techniques.length]);
  return (
    <React.Fragment>
      <Grid item xs={1}>
        <Stack spacing={0.6}>
          <Item sx={{ backgroundColor: '#F2F3F4', color: '#FFFFF'}}>{`${count} items`}</Item>
          <Item sx={{ backgroundColor: 'black', color: '#FFFFFF'}}>{name}</Item>
          { techniques.map(t => (
            <Item key={uuidv4()}>
              <Link key={uuidv4()}
                underline="hover"
                target="\_blank"
                rel="noreferrer"
                href={
                  t.tid.includes('.')
                  ? `https://attack.mitre.org/techniques/${t.tid.split('.')[0]}/${t.tid.split('.')[1]}`
                  : `https://attack.mitre.org/techniques/${t.tid}`
                }
              >
                {t.tid}
              </Link>
            </Item>
          ))}
        </Stack>
      </Grid>
    </React.Fragment>
  )
}

// eslint-disable-next-line
function loadTactics() {
  return [
    "initial-access",
    "execution",
    "persistence",
    "privilege-escalation",
    "defense-evasion",
    "credential-access",
    "discovery",
    "collection",
    "lateral-movement",
    "command-control",
    "exfiltration",
    "impact"
  ]
}
