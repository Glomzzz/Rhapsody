import {localesOf} from "../locales.js"

export type Category = {
    name: string,
    icon: string
}

type Config = Record<string, string>

export const locales = localesOf<Config>({
    root: {
        tech: 'Tech',
        life: 'Life',
        phil: 'Philosophy',
        roadmap: 'Roadmap',
        none: 'No Category'
    }
})

export const categories: Record<string, Category> = {
    'tech': {
        name: 'tech',
        icon: '/assets/components/categories/tech.svg'
    },
    'life': {
        name: 'life',
        icon: '/assets/components/categories/life.svg'
    },
    'roadmap':{
        name: 'roadmap',
        icon: '/assets/components/categories/roadmap.svg'
    },
    'philosophy': {
        name: 'philosophy',
        icon: '/assets/components/categories/philosophy.svg'
    },
    'none': {
        name: 'none',
        icon: '/assets/components/categories/none.svg'
    }
}


export function genCategories(lang: string): any[] {
    return Object.keys(categories).map(key => {
        return {
            text: locales[lang][key],
            link: '/archive?category=' + key,
            activeMatch: '/archive?category=' + key
        }
    })
}
