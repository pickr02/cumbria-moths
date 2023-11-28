define([],function () {

  function parseDate(strDate) {
    // Parse date from a single column
    // could potentially be a date range
    // specified in single column.
    let match = false
    for (let i=0; i<dateFormats.length; i++) {
      const df = dateFormats[i]
      match = df.rge.test(strDate.trim())
      if (match) {
        if (df.fn){
          return df.fn(strDate.trim())
        } else {
          return null
        }
      }
    }
    return null
  }

  function resolveYearsWeek(dateStartParsed, dateEndParsed) {
    // Given two arrays of form [startYear, endYear, week]
    // resolve to a single array.

    const yearStart1 = dateStartParsed[0]
    const yearEnd1 = dateStartParsed[1]
    const week1 = dateStartParsed[2]
    const yearStart2 = dateEndParsed[0]
    const yearEnd2 = dateEndParsed[1]
    const week2 = dateEndParsed[2]

    const yearStart = getYear(yearStart1, yearStart2, true)
    const yearEnd = getYear(yearEnd1, yearEnd2, false)
    const week = getWeek(week1, week2)
    
    return [yearStart, yearEnd, week]

    function getYear(year1, year2, bStart) {
      if (year1 && year2) {
        return bStart && year1 < year2 ? year1 : year2
      } else if (year1) {
        return year1
      } else if (year2) {
        return year2
      } else {
        return null
      }
    }

    function getWeek(week1, week2) {
      if (week1 && week2) {
        return week1
      } else if (week1) {
        return week1
      } else if (week2) {
        return week2
      } else {
        return null
      }
    }
  }

  function getWeek(m, d) {
    const month2day = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
    const days = month2day[m-1]+d
    return Math.floor(days/7)+1
  }

  mnthsShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  mnthsLong = ['January','February','March','April','May','June','July','August','September','October','November','December']


  const dateFormats = [
    {
      name: 'No date',
      example: '',
      rge: /^\s*$/,
      count: 0,
      fn: (dte) => {
        return [null, null, null]
      }
    },
    {
      name: 'Full1',
      example: '13/07/1978',
      rge: /^[0-3][0-9]\/[0-1][0-9]\/[1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split('/')
        const y = Number(s[2])
        const w = getWeek(Number(s[1]), Number(s[0]))
        return [y, y, w]
      },
    },
    {
      name: 'Full2',
      example: '15 May 1887',
      rge: /^[0-3][0-9] (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y = Number(s[2])
        const w = getWeek(mnthsShort.indexOf(s[1])+1, Number(s[0]))
        return [y, y, w]
      },
    },
    {
      name: 'Full3',
      example: '30-Jul-97',
      rge: /^[0-3][0-9]-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-[0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split('-')
        const y = Number(`19${s[2]}`)
        const w = getWeek(mnthsShort.indexOf(s[1])+1, Number(s[0]))
        return [y, y, w]
      },
    },
    {
      name: 'Full4',
      example: '30 July 1997',
      rge: /^[0-3][0-9] (January|February|March|April|May|June|July|August|September|October|November|December) [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y = Number(s[2])
        const w = getWeek(mnthsLong.indexOf(s[1])+1, Number(s[0]))
        return [y, y, w]
      },
    },
    {
      name: 'Full5',
      example: '30-Jul-1997',
      rge: /^[0-3][0-9]-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-[1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split('-')
        const y = Number(s[2])
        const w = getWeek(mnthsShort.indexOf(s[1])+1, Number(s[0]))
        return [y, y, w]
      },
    },
    {
      name: 'Full6',
      example: '1997-07-30',
      rge: /^[1-2][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split('-')
        const y = Number(s[0])
        const w = getWeek(Number(s[1]), Number(s[2]))
        return [y, y, w]
      },
    },
    {
      name: 'Month year 1',
      example: 'In August 1987',
      rge: /^[I|i]n (January|February|March|April|May|June|July|August|September|October|November|December) [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y = Number(s[2])
        return [y, y, null]
      },
    },
    {
      name: 'Month year 2',
      example: 'Aug-91',
      rge: /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-[0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split('-')
        const y = Number(`19${s[1]}`)
        return [y, y, null]
      },
    },
    {
      name: 'Month year 3',
      example: 'Aug 1991',
      rge: /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y = Number(s[1])
        return [y, y, null]
      },
    },
    {
      name: 'Month year 4',
      example: 'Aug 1991',
      rge: /^(January|February|March|April|May|June|July|August|September|October|November|December) [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y = Number(s[1])
        return [y, y, null]
      },
    },
    {
      name: 'Month year 5',
      example: 'In Sept. 1959',
      rge: /^In (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\. [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y = Number(s[2])
        return [y, y, null]
      },
    },
    {
      name: 'Month year 6',
      example: 'In Sept 1959',
      rge: /^In (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec) [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y = Number(s[2])
        return [y, y, null]
      },
    },
    {
      name: 'Mid month year',
      example: 'Mid-May 2006',
      rge: /^Mid-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y = Number(s[1])
        return [y, y, null]
      },
    },
    {
      name: 'Late month year 1',
      example: 'Mid-May 2006',
      rge: /^In late (January|February|March|April|May|June|July|August|September|October|November|December) [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y = Number(s[3])
        return [y, y, null]
      },
    },
    {
      name: 'Year',
      example: '1984',
      rge: /^[1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const y = Number(dte)
        return [y, y, null]
      },
    },
    {
      name: 'In year',
      example: 'In 1984',
      rge: /^(I|i)(N|n) [!,1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y = Number(s[1].replace('!', '1'))
        return [y, y, null]
      },
    },
    {
      name: 'Year range 1',
      example: '1980-1988',
      rge: /^[1-2][0-9][0-9][0-9]-[1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split('-')
        const y1 = Number(s[0])
        const y2 = Number(s[1])
        return [y1, y2, null]
      },
    },
    {
      name: 'Year range 2',
      example: 'In 1980-1988',
      rge: /^In [1-2][0-9][0-9][0-9]-[1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s0 = dte.split(' ')
        const s = s0[1].split('-')
        const y1 = Number(s[0])
        const y2 = Number(s[1])
        return [y1, y2, null]
      },
    },
    {
      name: 'Year range 3',
      example: 'From 1980 - 1988',
      rge: /^From [1-2][0-9][0-9][0-9] - [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = Number(s[1])
        const y2 = Number(s[3])
        return [y1, y2, null]
      },
    },
    {
      name: 'Year range 4',
      example: 'In 1980-88',
      rge: /^In [1-2][0-9][0-9][0-9]-[0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s0 = dte.split(' ')
        const s = s0[1].split('-')
        const y1 = Number(s[0])
        const y2 = Number(`${s[0].substr(0,2)}${s[1]}`)
        return [y1, y2, null]
      },
    },
    {
      name: 'Year range 5',
      example: '1980-88',
      rge: /^[1-2][0-9][0-9][0-9]-[0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split('-')
        const y1 = Number(s[0])
        const y2 = Number(`${s[0].substr(0,2)}${s[1]}`)
        return [y1, y2, null]
      },
    },
    {
      name: 'Year range 6',
      example: '1980 & 1988',
      rge: /^[1-2][0-9][0-9][0-9] & [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = Number(s[0])
        const y2 = Number(s[2])
        return [y1, y2, null]
      },
    },
    {
      name: 'Year range 7',
      example: 'In 1980-1',
      rge: /^In [1-2][0-9][0-9][0-9]-[0-9]$/,
      count: 0,
      fn: (dte) => {
        const s0 = dte.split(' ')
        const s = s0[1].split('-')
        const y1 = Number(s[0])
        const y2 = Number(`${s[0].substr(0,3)}${s[1]}`)
        return [y1, y2, null]
      },
    },
    {
      name: 'About year',
      example: 'About 1900',
      rge: /^About [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = Number(s[1])
        const y2 = Number(s[1])
        return [y1, y2, null]
      },
    },
    {
      name: 'About year 2',
      example: 'About 1900',
      rge: /^(Ca|ca) [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = Number(s[1])
        const y2 = Number(s[1])
        return [y1, y2, null]
      },
    },
    {
      name: 'Before year',
      example: 'Before 1999',
      rge: /^(Before|before) [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y2 = Number(s[1])-1
        return [null, y2, null]
      },
    },
    {
      name: 'Pre year',
      example: 'pre 1999',
      rge: /^(Pre|pre|Pre-) [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y2 = Number(s[1])-1
        return [null, y2, null]
      },
    },
    {
      name: 'To year',
      example: 'Before 1999',
      rge: /^(To|to) [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y2 = Number(s[1])
        return [null, y2, null]
      },
    },
    {
      name: 'From year range',
      example: 'From 1987-1999',
      rge: /^(From|from|FROM) [1-2][0-9][0-9][0-9]-[1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s0 = dte.split(' ')
        const s = s0[1].split('-')
        const y1 = Number(s[0])
        const y2 = Number(s[1])
        return [y1, y2, null]
      },
    },
    {
      name: 'From year range 2',
      example: 'From 1987-99',
      rge: /^From [1-2][0-9][0-9][0-9]-[0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s0 = dte.split(' ')
        const s = s0[1].split('-')
        const y1 = Number(s[0])
        let y2 = Number(`${s[0].substr(0,2)}${s[1]}`)
        if (y2 < y1) y2+=100
        return [y1, y2, null]
      },
    },
    {
      name: 'From year range 2',
      example: 'Frm 1987-1999',
      rge: /^Frm [1-2][0-9][0-9][0-9]-[1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s0 = dte.split(' ')
        const s = s0[1].split('-')
        const y1 = Number(s[0])
        const y2 = Number(s[1])
        return [y1, y2, null]
      },
    },
    {
      name: 'After year range',
      example: 'After 1987-1999',
      rge: /^After [1-2][0-9][0-9][0-9] to [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = Number(s[1])
        const y2 = Number(s[3])
        return [y1, y2, null]
      },
    },
    {
      name: 'After year',
      example: 'After 1999',
      rge: /^After [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = Number(s[1])+1
        return [y1, null, null]
      },
    },
    {
      name: 'After year 2',
      example: '(after 1999)',
      rge: /^\(after [1-2][0-9][0-9][0-9]\)$/,
      count: 0,
      fn: (dte) => {
        const s = dte.replace(')', '').split(' ')
        const y1 = Number(s[1])+1
        return [y1, null, null]
      },
    },
    {
      name: 'After year 3',
      example: '2000 onward',
      rge: /^([1-2][0-9][0-9][0-9]) onward$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = Number(s[0])
        return [y1, null, null]
      },
    },
    {
      name: 'After year 4',
      example: 'In 2000 onward',
      rge: /^In ([1-2][0-9][0-9][0-9]) onward$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = Number(s[1])
        return [y1, null, null]
      },
    },
    {
      name: 'After year 5',
      example: 'From 2000 onward',
      rge: /^From ([1-2][0-9][0-9][0-9]) onward$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = Number(s[1])
        return [y1, null, null]
      },
    },
    {
      name: 'In decade',
      example: 'In 1840s',
      rge: /^(In|in) [1-2][0-9][0-9]0s$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = Number(s[1].replace('s', ''))
        const y2 = y1 + 9
        return [y1, y2, null]
      },
    },
    {
      name: 'Early decade',
      example: 'Early 1840s',
      rge: /^Early [1-2][0-9][0-9]0s$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = Number(s[1].replace('s', ''))
        const y2 = y1 + 4
        return [y1, y2, null]
      },
    },
     {
      name: 'Late decade',
      example: 'In late 1840s',
      rge: /^In late [1-2][0-9][0-9]0s$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = Number(s[2].replace('s', '')) + 5
        const y2 = y1 + 4
        return [y1, y2, null]
      },
    },
    {
      name: 'In century',
      example: 'In 19th century',
      rge: /^In [1-2][0-9]th [c|C]entury$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = (Number(s[1].replace('th', '')) - 1) * 100
        const y2 = y1 + 99
        return [y1, y2, null]
      },
    },
    {
      name: 'Early century',
      example: 'Early 20th century',
      rge: /^Early [1-2][0-9]th century$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = (Number(s[1].replace('th', '')) - 1) * 100
        const y2 = y1 + 49
        return [y1, y2, null]
      },
    },
    {
      name: 'Late century',
      example: 'Late 20th century',
      rge: /^Late [1-2][0-9]th century$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = (Number(s[1].replace('th', '')) - 1) * 100 + 50
        const y2 = y1 + 49
        return [y1, y2, null]
      },
    },
    {
      name: 'Mid century',
      example: 'Mid 20th century',
      rge: /^Mid(-| )[1-2][0-9]th century$/,
      count: 0,
      fn: (dte) => {
        const s = dte.replace('-', ' ').split(' ')
        const y1 = (Number(s[1].replace('th', '')) - 1) * 100 + 26
        const y2 = y1 + 49
        return [y1, y2, null]
      },
    },
    {
      name: 'Mid century 2',
      example: 'Unknown (likely mid 20th century)',
      rge: /^Unknown \(likely mid [1-2][0-9]th century\)$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = (Number(s[3].replace('th', '')) - 1) * 100 + 26
        const y2 = y1 + 49
        return [y1, y2, null]
      },
    },
    {
      name: 'Season',
      example: 'Summer 1987',
      rge: /^(Spring|Summer|Autumn|Winter) [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = Number(s[1])
        return [y1, y1, null]
      },
    },
    {
      name: 'Odd 1',
      example: 'In June/July 2020',
      rge: /^In (January|February|March|April|May|June|July|August|September|October|November|December)\/(January|February|March|April|May|June|July|August|September|October|November|December) [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = Number(s[2])
        return [y1, y1, null]
      },
    },
    {
      name: 'Odd 2',
      example: 'In Septmber 1999',
      rge: /^In Septmber 1999$/,
      count: 0,
      fn: (dte) => {
        const s = dte.split(' ')
        const y1 = Number(s[2])
        return [y1, y1, null]
      },
    },
    {
      name: 'Odd 3',
      example: '2002 Before 2004',
      rge: /^2002 Before 2004$/,
      count: 0,
      fn: (dte) => {
        return [2002, 2003, null]
      },
    },
    {
      name: 'Odd 4',
      example: 'Early 20th century (no date)',
      rge: /^Early 20th century \(no date\)$/,
      count: 0,
      fn: (dte) => {
        return [1900, 1949, null]
      },
    },
    {
      name: 'Odd 5',
      example: 'Unknown (JJG assumed 1970-2000)',
      rge: /^Unknown \(JJG assumed 1970-2000\)$/,
      count: 0,
      fn: (dte) => {
        return [1970, 2000, null]
      },
    },
     {
      name: 'Odd 5',
      example: 'unknown (likely mid 19th century)',
      rge: /^unknown \(likely mid 19th century\)$/,
      count: 0,
      fn: (dte) => {
        return [1826, 1875, null]
      },
    },
    {
      name: 'Odd 6',
      example: 'To1997',
      rge: /^To1997$/,
      count: 0,
      fn: (dte) => {
        return [1997, 1997, null]
      },
    },
    {
      name: 'Odd 7',
      example: '10.06/1881',
      rge: /^10\.06\/1881$/,
      count: 0,
      fn: (dte) => {
        return [1881, 1881, getWeek(6,10)]
      },
    },
    {
      name: 'Odd 8',
      example: 'Early Sept. 2000',
      rge: /^Early Sept\. 2000$/,
      count: 0,
      fn: (dte) => {
        return [2000, 2000, null]
      },
    },
    {
      name: 'Odd 9',
      example: 'In september 1882',
      rge: /^In\s+(September|september|Seotember|Setember) [1-2][0-9][0-9][0-9]$/,
      count: 0,
      fn: (dte) => {
        const y = Number(dte.slice(-4))
        return [y, y, null]
      },
    },
    {
      name: 'Odd 10',
      example: 'In 2006/7',
      rge: /^In 2006\/7$/,
      count: 0,
      fn: (dte) => {
        return [2006, 2007, null]
      },
    },
    {
      name: 'Odd 11',
      example: 'In ca 1900',
      rge: /^In ca 1900$/,
      count: 0,
      fn: (dte) => {
        return [1900, 1900, null]
      },
    },
    {
      name: 'Odd 12',
      example: 'In 1802 and 1820',
      rge: /^In 1802 and 1820$/,
      count: 0,
      fn: (dte) => {
        return [1802, 1820, null]
      },
    },
    {
      name: 'Odd 13',
      example: 'In June 20006',
      rge: /^In June 20006$/,
      count: 0,
      fn: (dte) => {
        return [2006, 2006, null]
      },
    },
    {
      name: 'Odd 14',
      example: '24/98/1924',
      rge: /^24\/98\/1924$/,
      count: 0,
      fn: (dte) => {
        return [1924, 1924, null]
      },
    },
    {
      name: 'Odd 15',
      example: 'Post- 2004',
      rge: /^Post- 2004$/,
      count: 0,
      fn: (dte) => {
        return [2005, null, null]
      },
    },
    {
      name: 'Odd 16',
      example: 'From 1982-198',
      rge: /^From 1982-198$/,
      count: 0,
       fn: (dte) => {
        return [1982, 1982, null]
      },
    },
    {
      name: 'Odd 17',
      example: 'Early September 2000',
      rge: /^Early September 2000$/,
      count: 0,
      fn: (dte) => {
        return [2000, 2000, null]
      },
    },
    {
      name: 'Odd 18',
      example: '1880 - 1905',
      rge: /^1880 - 1905$/,
      count: 0,
      fn: (dte) => {
        return [1880, 1905, null]
      },
    },
    {
      name: 'Odd 19',
      example: 'Early July 1840',
      rge: /^Early July 1840$/,
      count: 0,
      fn: (dte) => {
        return [1840, 1840, null]
      },
    },
    {
      name: 'Odd 20',
      example: 'unknown (19/20 century)',
      rge: /^unknown \(19\/20 century\)$/,
      count: 0,
      fn: (dte) => {
        return [1801, 1999, null]
      },
    },
    {
      name: 'Odd 21',
      example: '2092200%',
      rge: /^2092200%$/,
      count: 0,
      fn: (dte) => {
        return [null, null, null]
      },
    },
    {
      name: 'Odd 22',
      example: 'In 1883 (1st)',
      rge: /^In 1883 \(1st\)$/,
      count: 0,
      fn: (dte) => {
        return [1883, 1883, null]
      },
    },
    {
      name: 'Odd 23',
      example: '03/08/217',
      rge: /^03\/08\/217$/,
      count: 0,
      fn: (dte) => {
        return [2017, 2017, getWeek(8,3)]
      },
    },
    {
      name: 'Odd 24',
      example: '29/96/1833',
      rge: /^29\/96\/1833$/,
      count: 0,
      fn: (dte) => {
        return [1833, 1833, null]
      },
    },
    {
      name: 'Odd 25',
      example: '28/7/1887',
      rge: /^28\/7\/1887$/,
      count: 0,
      fn: (dte) => {
        return [1887, 1887, getWeek(7,28)]
      },
    },
    {
      name: 'Odd 26',
      example: '2001 Before 2004',
      rge: /^2001 Before 2004$/,
      count: 0,
      fn: (dte) => {
        return [2001, 2003, null]
      },
    },
    {
      name: 'Odd 27',
      example: '31/08/2013��������',
      rge: /^31\/08\/2013��������$/,
      count: 0,
      fn: (dte) => {
        return [2013, 2013, getWeek(8,31)]
      },
    },
    {
      name: 'Odd 28',
      example: 'Reported 2012',
      rge: /^Reported 2012$/,
      count: 0,
      fn: (dte) => {
        return [2012, 2012, null]
      },
    },
  ]

  return {
    parseDate: parseDate,
    resolveYearsWeek: resolveYearsWeek
  }
})