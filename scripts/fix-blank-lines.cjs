#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const exts = ['.html', '.ts', '.js', '.css']

function walk(dir) {
  const res = []
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === '.angular')
      continue
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) res.push(...walk(p))
    else if (exts.includes(path.extname(name))) res.push(p)
  }
  return res
}

function fixFile(file) {
  const original = fs.readFileSync(file, 'utf8')
  let fixed = original.replace(/\n{3,}/g, '\n\n')
  fixed = fixed.replace(/\n{2,}/g, '\n\n')
  if (fixed !== original) {
    fs.writeFileSync(file, fixed, 'utf8')
    console.log('Fixed:', file)
  }
}

const root = process.cwd()
const files = walk(root)
for (const f of files) fixFile(f)
console.log('Done')
