import React from 'react';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
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
      ? temp[d.tactic].techniques.push({
        tid: d.tid, technique: d.technique, malware: d.correlation_malware, tool: d.correlation_tool })
      : temp[d.tactic] = { techniques: [{tid: d.tid, technique: d.technique,
                            malware: d.correlation_malware, tool: d.correlation_tool }] }
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
            <Technique Technique key={uuidv4()} technique={t} />
          ))}
        </Stack>
      </Grid>
    </React.Fragment>
  )
}

const Technique = ({ technique }) => {
  var bg = { backgroundColor: '#fffff', color: 'white' };
  var tt = '';
  let wants_light_font = false;
  if (technique.malware !== "none" && technique.tool === "none") {
    bg.backgroundColor = "red";
    wants_light_font = true;
    tt = technique.malware
  }
  else if (technique.malware === "none" && technique.tool !== "none") {
    bg.backgroundColor = "blue";
    wants_light_font = true;
    tt = technique.tool;
  }
  else if (technique.malware !== "none" && technique.tool !== "none") {
    bg.backgroundColor = "purple";
    wants_light_font = true;
    tt = `${technique.malware}|${technique.tool}`;
  }
  if (technique.tool.includes("empire")) {
    bg.backgroundColor = "#004D40";
    wants_light_font = true;
    tt = technique.tool;
  }
  tt = tt.split('|').join('\n\n\n\n');
  //console.log(JSON.stringify(technique));
  return (
    <Tooltip title={tt} arrow placement="right">
      <Item key={uuidv4()}
        sx={bg}
      >
        <Link key={uuidv4()}
          underline="hover"
          target="\_blank"
          rel="noreferrer"
          sx={ wants_light_font ? {color: '#ffffff'} : null }
          href={
            technique.tid.includes('.')
            ? `https://attack.mitre.org/techniques/${technique.tid.split('.')[0]}/${technique.tid.split('.')[1]}`
            : `https://attack.mitre.org/techniques/${technique.tid}`
          }
        >
          {`${technique.tid} - ${technique.technique}`}
        </Link>
      </Item>
    </Tooltip>
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
    "command-and-control",
    "exfiltration",
    "impact"
  ]
}
