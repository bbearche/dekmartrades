<?php
/**
 * Description of Shortcodes
 *
 */
class MPCEShortcode {
    const PREFIX = 'mp_';

    private $shortcodeFunctions = array(
        'row' => 'motopressRow',
        'row_inner' => 'motopressRowInner',
        'span' => 'motopressSpan',
        'span_inner' => 'motopressSpanInner',
        'text' => 'motopressText',
        'heading' => 'motopressTextHeading',
        'image' => 'motopressImage',
        'image_slider' => 'motopressImageSlider',
        'video' => 'motopressVideo',
        'code' => 'motopressCode',
        'space' => 'motopressSpace',
        'button' => 'motopressButton',
        'wp_archives' => 'motopressWPWidgetArchives',
        'wp_calendar' => 'motopressWPWidgetCalendar',
        'wp_categories' => 'motopressWPWidgetCategories',
        'wp_navmenu' => 'motopressWPNavMenu_Widget',
        'wp_meta' => 'motopressWPWidgetMeta',
        'wp_pages' => 'motopressWPWidgetPages',
        'wp_posts' => 'motopressWPWidgetRecentPosts',
        'wp_comments' => 'motopressWPWidgetRecentComments',
        'wp_rss' => 'motopressWPWidgetRSS',
        'wp_search' => 'motopressWPWidgetSearch',
        'wp_tagcloud' => 'motopressWPWidgetTagCloud',
        'wp_widgets_area' => 'motopressWPWidgetArea',
        'gmap' => 'motopressGoogleMap',
        'embed' => 'motopressEmbedCode',
        'quote' => 'motopressQuotes',
        'members_content' => 'motopressMembersContent',
        'social_buttons' => 'motopressSocialShare',
        'google_chart' => 'motopressGoogleCharts',
        'wp_audio' => 'motopressWPAudio',
        'tabs' => 'motopressTabs',
        'tab' => 'motopressTab',
        'table' => 'motopressTable'
    );

    public static $attributes = array(
        'closeType' => 'data-motopress-close-type',
        'shortcode' => 'data-motopress-shortcode',
        'group' => 'data-motopress-group',
        'parameters' => 'data-motopress-parameters',
        'content' => 'data-motopress-content',
        'unwrap' => 'data-motopress-unwrap'
    );

    public function register() {
        add_filter( 'the_content', array($this, 'runShortcodesBeforeAutop'), 8 );
        $shortcode = $this->shortcodeFunctions;
        foreach ($shortcode as $sortcode_name => $function_name) {
            add_shortcode(self::PREFIX . $sortcode_name, array($this, $function_name));
        }
    }

    /**
     * @param string $content
     * @return string
     */
    public function runShortcodesBeforeAutop($content) {
        global $shortcode_tags;
        // Back up current registered shortcodes and clear them all out
        $orig_shortcode_tags = $shortcode_tags;
        remove_all_shortcodes();

        $shortcode = $this->shortcodeFunctions;
        foreach ($shortcode as $sortcode_name => $function_name) {
            add_shortcode(self::PREFIX . $sortcode_name, array($this, $function_name));
        }

        // Do the shortcode (only the [motopress shortcodes] are registered)
        $content = do_shortcode( $content );
        // Put the original shortcodes back
        $shortcode_tags = $orig_shortcode_tags;

        return $content;
    }

    /**
     * @param string $content
     * @return string
     */
    public function cleanupShortcode($content) {
        return strtr($content, array(
            '<p>[' => '[',
            '</p>[' => '[',
            ']<p>' => ']',
            ']</p>' => ']',
            ']<br />' => ']'
        ));
    }

    /**
     * @param string $closeType
     * @param string $shortcode
     * @param stdClass $parameters
     * @param string $classes
     * @param string $content
     * @return string
     */
    public function toShortcode($closeType, $shortcode, $parameters, $classes, $content) {
        $str = '[' . $shortcode;
        if (!is_null($parameters)) {
            foreach ($parameters as $attr => $values) {
//                $value = (isset($values->value)) ? $values->value : '';
                if (isset($values->value)) {
                    $str .= ' ' . $attr . '="' . $values->value . '"';
                }
            }
        }
        if (!is_null($classes)) {
            $str .= ' classes="' . $classes . '"';
        }
        $str .= ']';
        if ($closeType === MPCEObject::ENCLOSED) {
            if (!is_null($content)) {
                $str .= $content;
            }
            $str .= '[/' . $shortcode . ']';
        }
        return $str;
    }

    /**
     * @param array $defAtts
     * @return array
     */
    /*
    public static function addDefAtts($defAtts = array()) {
        $defAtts['custom_class'] = '';
        $defAtts['classes'] = '';
        return $defAtts;
    }
    */

    public function motopressRow($atts, $content = null) {
        return '<div class="mp-row-fluid motopress-row">' . do_shortcode($content) . '</div>';
    }

    public function motopressRowInner($atts, $content = null) {
        return '<div class="mp-row-fluid motopress-row">' . do_shortcode($content) . '</div>';
    }

    public function motopressSpan($atts, $content = null) {
        extract(shortcode_atts(array(
            'col' => 12,
            'classes' => '',
            'style' => ''
        ), $atts));
        if (!empty($classes)) $classes = ' ' . $classes;
        $style = empty($style) ? '' : ' style="' . $style . '"';
        return '<div class="mp-span' . $col . ' motopress-span' . $classes . '"' . $style . '>' . do_shortcode($content) . '</div>';
    }

    public function motopressSpanInner($atts, $content = null) {
        extract(shortcode_atts(array(
            'col' => 12,
            'classes' => '',
            'style' => ''
        ), $atts));
        if (!empty($classes)) $classes = ' ' . $classes;
        $style = empty($style) ? '' : 'style="' . $style . '"';
        return '<div class="mp-span' . $col . ' motopress-span' . $classes . '" ' . $style . '>' . do_shortcode($content) . '</div>';
    }

    public function motopressText($atts, $content = null) {
        /*
        $defAtts = self::addDefAtts();
        extract(shortcode_atts($defAtts, $atts));
        */
        extract(shortcode_atts(array(
            'classes' => ''
        ), $atts));
        if (!empty($classes)) $classes = ' ' . $classes;
        return '<div class="motopress-text-obj' . $classes . '">' . $content . '</div>';
    }

    public function motopressTextHeading($atts, $content = null) {
        extract(shortcode_atts(array(
            'classes' => ''
        ), $atts));
        if (!empty($classes)) $classes = ' ' . $classes;
        $result = empty($content) ? '<h2>' . $content . '</h2>' : $content;
        return '<div class="motopress-text-obj' . $classes . '">' . $result . '</div>';
    }

    public function motopressImage($atts, $content = null) {
        extract(shortcode_atts(array(
            'id' => '',
            
            'align' => 'left',
//            'scale' => 'crop',
//            'lightbox' => 'true'
            'classes' => ''
        ), $atts));

        global $motopressCESettings;
        require_once $motopressCESettings['plugin_root'] . '/' . $motopressCESettings['plugin_name'] . '/includes/getLanguageDict.php';
        $motopressCELang = motopressCEGetLanguageDict();
        $error = null;

        if (isset($id) && !empty($id)) {
            $id = (int) $id;
            $attachment = get_post($id);
            $target = ($target == 'true') ? '_blank' : '_self';
            if (!empty($attachment) && $attachment->post_type === 'attachment') {
                if (wp_attachment_is_image($id)) {
                    $title = esc_attr($attachment->post_title);

                    $alt = trim(strip_tags(get_post_meta($id, '_wp_attachment_image_alt', true)));
                    if (empty($alt)) {
                        $alt = trim(strip_tags($attachment->post_excerpt));
                    }
                    if (empty($alt)) {
                        $alt = trim(strip_tags($attachment->post_title));
                    }

                    $img = '<img';
                    if (!empty($attachment->guid)) {
                        $img .= ' src="' . $attachment->guid . '"';
                    }
                    if (!empty($title)) {
                        $img .= ' title="' . $title . '"';
                    }
                    if (!empty($alt)) {
                        $img .= ' alt="' . $alt . '"';
                    }
                    $img .= ' />';
                    
                } else {
                    $error = $motopressCELang->CEAttachmentNotImage;
                }
            } else {
                $error = $motopressCELang->CEAttachmentEmpty;
            }
        } else {
            $error = $motopressCELang->CEImageIdEmpty;
        }

        if (!empty($classes)) $classes = ' ' . $classes;
        $imgHtml = '<div class="motopress-image-obj motopress-text-align-' . $align . $classes . '">';
        if (empty($error)) {
            $imgHtml .= $img;
        } else {
            $imgHtml .= $error;
        }
        $imgHtml .= '</div>';

        return $imgHtml;
    }

    public function motopressImageSlider($atts, $content = null) {
        extract(shortcode_atts(array(
            'ids' => '',
            
            'classes' => ''
        ), $atts));

        global $motopressCESettings;
        require_once $motopressCESettings['plugin_root'] . '/' . $motopressCESettings['plugin_name'] . '/includes/getLanguageDict.php';
        $motopressCELang = motopressCEGetLanguageDict();
        $error = null;

        if (isset($ids) && !empty($ids)) {
            $ids = trim($ids);
            $ids = explode(',', $ids);
            $ids = array_filter($ids);

            if (!empty($ids)) {
                wp_enqueue_style('mpce-flexslider');
                wp_enqueue_script('mpce-flexslider');

                $images = array();
                $imageErrors = array();
                foreach ($ids as $id) {
                    $id = (int) trim($id);

                    $attachment = get_post($id);
                    if (!empty($attachment) && $attachment->post_type === 'attachment') {
                        if (wp_attachment_is_image($id)) {
                            $title = esc_attr($attachment->post_title);

                            $alt = trim(strip_tags(get_post_meta($id, '_wp_attachment_image_alt', true)));
                            if (empty($alt)) {
                                $alt = trim(strip_tags($attachment->post_excerpt));
                            }
                            if (empty($alt)) {
                                $alt = trim(strip_tags($attachment->post_title));
                            }

                            $img = '<img';
                            if (!empty($attachment->guid)) {
                                $img .= ' src="' . $attachment->guid . '"';
                            }
                            if (!empty($title)) {
                                $img .= ' title="' . $title . '"';
                            }
                            if (!empty($alt)) {
                                $img .= ' alt="' . $alt . '"';
                            }
                            $img .= ' />';

                            $images[] = $img;
                            unset($img);
                        } else {
                            $imageErrors[] = $motopressCELang->CEAttachmentNotImage;
                        }
                    } else {
                        $imageErrors[] = $motopressCELang->CEAttachmentEmpty;
                    }
                }
            } else {
                $error = $motopressCELang->CEImageSliderIdsEmpty;
            }
        } else {
            $error = $motopressCELang->CEImageSliderIdsEmpty;
        }

        if (!empty($classes)) $classes = ' ' . $classes;
        $uniqid = uniqid();
        $sliderHtml = '<div class="motopress-image-slider-obj flexslider' . $classes . '" id="' . $uniqid . '">';
        if (empty($error)) {
            if (!empty($images)) {
                $sliderHtml .= '<ul class="slides">';
                foreach ($images as $image) {
                    $sliderHtml .= '<li>' . $image . '</li>';
                }
                $sliderHtml .= '</ul>';
            } elseif (!empty($imageErrors)) {
                $sliderHtml .= '<ul>';
                foreach ($imageErrors as $imageError) {
                    $sliderHtml .= '<li>' . $imageError . '</li>';
                }
                $sliderHtml .= '</ul>';
            }
        } else {
            $sliderHtml .= $error;
        }
        $sliderHtml .= '</div>';

        $slideshow = (self::isContentEditor()) ? 'false' : 'true';
        $keyboard = (self::isContentEditor()) ? 'false' : 'true';
        $sliderHtml .= '<script type="text/javascript">
            jQuery(document).ready(function($) {
                var mpImageSlider = $(".motopress-image-slider-obj#' . $uniqid . '");
                if (mpImageSlider.data("flexslider")) {
                    mpImageSlider.flexslider("destroy");
                }
                mpImageSlider.flexslider({
                    slideshow: ' . $slideshow .  ',
                    animation: "' . 'fade' . '",
                    controlNav: ' . 'true' . ',
                    slideshowSpeed: ' . '7000' . ',
                    smoothHeight: ' . 'false' . ',
                    keyboard: ' . $keyboard . ',
                });
            });
            </script>';
        return $sliderHtml;
    }

    const DEFAULT_VIDEO = 'www.youtube.com/watch?v=t0jFJmTDqno';
    const YOUTUBE = 'youtube';
    const VIMEO = 'vimeo';

    public function motopressVideo($atts, $content = null) {
        extract(shortcode_atts(array(
            'src' => '',
            'classes' => ''
        ), $atts));

        global $motopressCESettings;
        require_once $motopressCESettings['plugin_root'] . '/' . $motopressCESettings['plugin_name'] . '/includes/getLanguageDict.php';
        $motopressCELang = motopressCEGetLanguageDict();
        $error = null;

        if (!empty($src)) {
            $src = filter_var($src, FILTER_SANITIZE_URL);
            $src = str_replace('&amp;', '&', $src);
            $url = parse_url($src);
            if ($url) {
                if (!isset($url['scheme']) || empty($url['scheme'])) {
                    $src = 'http://' . $src; //protocol use only for correct parsing url
                    $url = parse_url($src);
                }
            }

            if ($url) {
                if (isset($url['host']) && !empty($url['host']) && isset($url['path']) && !empty($url['path'])) {
                    $videoSite = self::getVideoSite($url);
                    if ($videoSite) {
                        $videoId = self::getVideoId($videoSite, $url);
                        if ($videoId) {
                            $query = (isset($url['query'])) ? $url['query'] : null;
                            $src = self::getVideoSrc($videoSite, $videoId, $query);
                        } else {
                            $error = $motopressCELang->CEVideoIdError;
                        }
                    } else {
                        $error = $motopressCELang->CEIncorrectVideoURL;
                    }
                } else {
                    $error = $motopressCELang->CEIncorrectVideoURL;
                }
            } else {
                $error = $motopressCELang->CEParseVideoURLError;
            }
        } else {
            $error = $motopressCELang->CEIncorrectVideoURL;
        }

        if (!empty($classes)) $classes = ' ' . $classes;
        $videoHtml = '<div class="motopress-video-obj' . $classes . '">';
        if (empty($error)) {
            $videoHtml .= '<iframe src="' . $src . '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
        } else {
            $videoHtml .= $error;
        }
        $videoHtml .= '</div>';

        return $videoHtml;
    }

    private static function getVideoSite($url) {
        $videoSite = false;

        $youtubeRegExp = '/youtube\.com|youtu\.be/is';
        $vimeoRegExp = '/vimeo\.com/is';
        if (preg_match($youtubeRegExp, $url['host'])) {
            $videoSite = self::YOUTUBE;
        } else if (preg_match($vimeoRegExp, $url['host'])) {
            $videoSite = self::VIMEO;
        }

        return $videoSite;
    }

    private static function getVideoId($videoSite, $url) {
        $videoId = false;

        switch ($videoSite) {
            case self::YOUTUBE:
                if (preg_match('/youtube\.com/is', $url['host'])) {
                    if (preg_match('/watch/is', $url['path']) && isset($url['query']) && !empty($url['query'])) {
                        parse_str($url['query'], $parameters);
                        if (isset($parameters['v']) && !empty($parameters['v'])) {
                            $videoId = $parameters['v'];
                        }
                    } else if (preg_match('/embed/is', $url['path'])) {
                        $path = explode('/', $url['path']);
                        if (isset($path[2]) && !empty($path[2])) {
                            $videoId = $path[2];
                        }
                    }
                } else if (preg_match('/youtu\.be/is', $url['host'])) {
                    $path = explode('/', $url['path']);
                    if (isset($path[1]) && !empty($path[1])) {
                        $videoId = $path[1];
                    }
                }
                break;
            case self::VIMEO:
                if (preg_match('/player\.vimeo\.com/is', $url['host']) && preg_match('/video/is', $url['path'])) {
                    $path = explode('/', $url['path']);
                    if (isset($path[2]) && !empty($path[2])) {
                        $videoId = $path[2];
                    }
                } else if (preg_match('/vimeo\.com/is', $url['host'])) {
                    $path = explode('/', $url['path']);
                    if (isset($path[1]) && !empty($path[1])) {
                        $videoId = $path[1];
                    }
                }
                break;
        }

        return $videoId;
    }

    private static function getVideoSrc($videoSite, $videoId, $query) {
        $youtubeSrc = '//www.youtube.com/embed/';
        $vimeoSrc = '//player.vimeo.com/video/';
        $videoQuery = '';
        $wmode = 'wmode=opaque';

        if (!empty($query)) {
            parse_str($query, $parameters);
            if (self::isContentEditor()) {
                if (isset($parameters['autoplay']) && !empty($parameters['autoplay'])) {
                    unset($parameters['autoplay']);
                }
            }
        }

        switch ($videoSite) {
            case self::YOUTUBE:
                $videoSrc = $youtubeSrc;
                if (isset($parameters['v']) && !empty($parameters['v'])) {
                    unset($parameters['v']);
                }
                break;
            case self::VIMEO:
                $videoSrc = $vimeoSrc;
                break;
        }

        $videoSrc .= $videoId;

        if (!empty($parameters)) {
            $videoQuery = http_build_query($parameters);
        }

        if (!empty($videoQuery)) {
            $videoSrc .= '?' . $videoQuery . '&' . $wmode;
        } else {
            $videoSrc .= '?' . $wmode;
        }

        return $videoSrc;
    }

    public static function isContentEditor() {
        if (
            (isset($_GET['motopress-ce']) && $_GET['motopress-ce'] === '1') ||
            (isset($_POST['action']) && $_POST['action'] === 'motopress_ce_render_shortcode')
        ) {
            return true;
        }
        return false;
    }

    public function motopressCode($atts, $content = null) {
        extract(shortcode_atts(array(
            'classes' => ''
        ), $atts));
        if (!empty($classes)) $classes = ' ' . $classes;
        return '<div class="motopress-code-obj' . $classes . '">' . do_shortcode($content) . '</div>';
    }

    public function motopressSpace($atts, $content = null) {
        return '<div class="motopress-space-obj"></div>';
    }

    public function motopressButton($atts, $content = null) {
        extract(shortcode_atts(array(
            'text' => '',
            'link' => '#',
            
            'color' => 'default',
            'size' => 'default',
            'align' => 'left',
            
            'classes' => ''
        ), $atts));

        if (!empty($classes)) $classes = ' ' . $classes;
        $buttonClasses = array(
            'motopress-btn-color-' . $color,
            'motopress-btn-size-' . $size
        );
        $buttonClasses = implode(' ', $buttonClasses);
        $align = 'motopress-text-align-' . $align;
        
        return '<div class="motopress-button-obj ' . $align . $classes . '">' .
              '<a href="' . $link . '" class="motopress-btn ' . $buttonClasses . '" ">' . $text . '</a>' .
              '</div>';
    }

    public function motopressWPWidgetArchives($attrs, $content = null) {
        $result = '';
        $title = '';
        extract(shortcode_atts(array(
            'title' => '',
            'dropdown' => '',
            'count' => '',
            'classes' => ''
        ), $attrs));

        ($dropdown == 'true' || $dropdown == 1)  ? $attrs['dropdown'] = 1 : $attrs['dropdown'] = 0;
        ($count == 'true' || $count == 1) ? $attrs['count'] = 1 : $attrs['count'] = 0;
        if (!empty($classes)) $classes = ' ' . $classes;
        $result = '<div class="motopress-wp_archives' . $classes . '">';
        $type = 'WP_Widget_Archives';
        $args = array();

        ob_start();
        the_widget($type, $attrs, $args);
        $result .= ob_get_clean();

        $result .= '</div>';

        return $result;
    }

    public function motopressWPWidgetCalendar($attrs, $content = null) {
        $result = '';
        $title = '';
        extract(shortcode_atts(array(
            'title' => '',
            'classes' => ''
        ), $attrs));
        if (!empty($classes)) $classes = ' ' . $classes;
        $result = '<div class="motopress-wp_calendar' . $classes . '">';
        $type = 'WP_Widget_Calendar';
        $args = array();

        ob_start();
        the_widget($type, $attrs, $args);
        $result .= ob_get_clean();

        $result .= '</div>';

        return $result;
    }

    public function motopressWPWidgetCategories($attrs, $content = null) {
        $result = '';
        $title = '';
        extract(shortcode_atts(array(
            'title' => '',
            'dropdown' => '',
            'count' => '',
            'hierarchical' => '',
            'classes' => ''
        ), $attrs));

        ($dropdown == 'true' || $dropdown == 1) ? $attrs['dropdown'] = 1 : $attrs['dropdown'] = 0;
        ($count == 'true' || $count == 1) ? $attrs['count'] = 1 : $attrs['count'] = 0;
        ($hierarchical == 'true' || $hierarchical == 1) ? $attrs['hierarchical'] = 1 : $attrs['hierarchical'] = 0;
        if (!empty($classes)) $classes = ' ' . $classes;
        $result = '<div class="motopress-wp_categories' . $classes . '">';
        $type = 'WP_Widget_Categories';
        $args = array();

        ob_start();
        the_widget($type, $attrs, $args);
        $result .= ob_get_clean();

        $result .= '</div>';

        return $result;
    }

    public function motopressWPNavMenu_Widget($attrs, $content = null) {
        $result = '';
        $title = '';
        $nav_menu = '';
        extract(shortcode_atts(array(
            'title' => '',
            'nav_menu' => '',
            'classes' => ''
        ), $attrs));
        if (!empty($classes)) $classes = ' ' . $classes;
        $result = '<div class="motopress-wp_custommenu' . $classes . '">';
        $type = 'WP_Nav_Menu_Widget';
        $args = array();

        ob_start();
        the_widget($type, $attrs, $args);
        $result .= ob_get_clean();

        $result .= '</div>';

        return $result;
    }

    public function motopressWPWidgetMeta($attrs, $content = null) {
        $result = '';
        $title = '';
        extract(shortcode_atts(array(
            'title' => '',
            'classes' => ''
        ), $attrs));
        if (!empty($classes)) $classes = ' ' . $classes;
        $result = '<div class="motopress-wp_meta' . $classes . '">';
        $type = 'WP_Widget_Meta';
        $args = array();

        ob_start();
        the_widget($type, $attrs, $args);
        $result .= ob_get_clean();

        $result .= '</div>';

        return $result;
    }

    public function motopressWPWidgetPages($attrs, $content = null) {
        $result = '';
        $title = '';
        $sortby = '';
        $exclude = '';
        extract(shortcode_atts(array(
            'title' => '',
            'sortby' => 'menu_order',
            'exclude' => null,
            'classes' => ''
        ), $attrs));
        if (!empty($classes)) $classes = ' ' . $classes;
        $result = '<div class="motopress-wp_pages' . $classes . '">';
        $type = 'WP_Widget_Pages';
        $args = array();

        ob_start();
        the_widget($type, $attrs, $args);
        $result .= ob_get_clean();

        $result .= '</div>';

        return $result;
    }

    public function motopressWPWidgetRecentPosts($attrs, $content = null) {
        $result = '';
        $title = '';
        $number = '';
        $show_date = '';
        extract(shortcode_atts(array(
            'title' => '',
            'number' => 5,
            'show_date' => false,
            'classes' => ''
        ), $attrs));
        ($show_date == 'true' || $show_date == 1) ? $attrs['show_date'] = 1 : $attrs['show_date'] = 0;
        if (!empty($classes)) $classes = ' ' . $classes;
        $result = '<div class="motopress-wp_posts' . $classes . '">';
        $type = 'WP_Widget_Recent_Posts';
        $args = array();

        ob_start();
        the_widget($type, $attrs, $args);
        $result .= ob_get_clean();

        $result .= '</div>';

        return $result;
    }

    public function motopressWPWidgetRecentComments($attrs, $content = null) {
        $result = '';
        $title = '';
        $number = '';
        extract(shortcode_atts(array(
            'title' => '',
            'number' => 5,
            'classes' => ''
        ), $attrs));
        if (!empty($classes)) $classes = ' ' . $classes;
        $result = '<div class="motopress-wp_recentcomments' . $classes . '">';
        $type = 'WP_Widget_Recent_Comments';
        $args = array();

        ob_start();
        the_widget($type, $attrs, $args);
        $result .= ob_get_clean();

        $result .= '</div>';

        return $result;
    }

    public function motopressWPWidgetRSS($attrs, $content = null) {
        $result = '';
        $title = '';
        $url = '';
        $items = '';
        $options = '';
        extract(shortcode_atts(array(
            'title' => '',
            'url' => '',
            'items' => 10,
            'show_summary' => '',
            'show_author' => '',
            'show_date' => '',
            'classes' => ''
        ), $attrs));
        if ($url == '')
            return;
        $attrs['title'] = $title;
        $attrs['items'] = ($items + 1);

        ($show_summary == 'true' || $show_summary == 1) ? $attrs['show_summary'] = 1 : $attrs['show_summary'] = 0;
        ($show_author == 'true' || $show_author == 1) ? $attrs['show_author'] = 1 : $attrs['show_author'] = 0;
        ($show_date == 'true' || $show_date == 1) ? $attrs['show_date'] = 1 : $attrs['show_date'] = 0;
        if (!empty($classes)) $classes = ' ' . $classes;
        $result = '<div class="motopress-wp_rss' . $classes . '">';
        $type = 'WP_Widget_RSS';
        $args = array();

        ob_start();
        the_widget($type, $attrs, $args);
        $result .= ob_get_clean();

        $result .= '</div>';

        return $result;
    }

    public function motopressWPWidgetSearch($attrs, $content = null) {
        extract(shortcode_atts(array(
            'title' => '',
            'align' => 'left',
            'classes' => ''
        ), $attrs));
        if (!empty($classes)) $classes = ' ' . $classes;
        $result = '<div class="motopress-wp_search_widget' . $classes . '">';
        $type = 'WP_Widget_Search';
        $args = array();

        ob_start();
        the_widget($type, $attrs, $args);
        $result .= ob_get_clean();

        $result .= '</div>';

        return $result;
    }

    public function motopressWPWidgetTagCloud($attrs, $content = null) {
        $result = '';
        $title = '';
        $taxonomy = '';
        extract(shortcode_atts(array(
            'title' => __('Tags'),
            'taxonomy' => 'post_tag',
            'classes' => ''
        ), $attrs));
        if (!empty($classes)) $classes = ' ' . $classes;
        $result = '<div class="motopress-wp_tagcloud' . $classes . '">';
        $type = 'WP_Widget_Tag_Cloud';
        $args = array();

        ob_start();
        the_widget($type, $attrs, $args);
        $result .= ob_get_clean();

        $result .= '</div>';

        return $result;
    }

    public function motopressWPWidgetArea($attrs, $content = null) {
        $result = '';
        $title = '';
        $sidebar = '';
        extract(shortcode_atts(array(
            'title' => '',
            'sidebar' => '',
            'custom_class' => '',
            'classes' => ''
        ), $attrs));
        if (!empty($classes)) $classes = ' ' . $classes;
        $result = '<div class="motopress-wp_widgets_area ' . $custom_class . $classes . '">';

        if ($title)
            $result .= '<h2 class="widgettitle">' . $title . '</h2>';

        if (function_exists('dynamic_sidebar') && $sidebar && $sidebar != 'no') {
            ob_start();
            dynamic_sidebar($sidebar);
            $result .= ob_get_clean();

            $result .= '</div>';

            return $result;
        } else {
            return false;
        }
    }

    public function motopressGoogleMap($attrs, $content = null) {
        global $motopressCESettings;
        require_once $motopressCESettings['plugin_root'] . '/' . $motopressCESettings['plugin_name'] . '/includes/getLanguageDict.php';
        require_once $motopressCESettings['plugin_root'] . '/' . $motopressCESettings['plugin_name'] . '/includes/Requirements.php';

        $motopressCELang = motopressCEGetLanguageDict();

        $result = $motopressCELang->CEGoogleMapNothingFound;
        $address = '';
        $zoom = '';
        extract( shortcode_atts(array(
            'address' => 'Sidney, New South Wales, Australia',
            'zoom' => '13',
            'classes' => ''
        ), $attrs ));

        if ( $address == '' ) { return $result; }

        $address = str_replace(" ", "+", $address);
        $url = 'http://maps.googleapis.com/maps/api/geocode/json?address='. $address .'&sensor=false';

        $requirements = new MPCERequirements();
        if ($requirements->getCurl()) {
            $ch = curl_init();
            $options = array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true
            );
            curl_setopt_array($ch, $options);
            $jsonData = curl_exec($ch);
            curl_close($ch);
        } else {
            $jsonData = file_get_contents($url);
        }

        $data = json_decode($jsonData);

        if ($data && isset($data->results))
        {
            $results = $data->{'results'};
            if ($results && $results[0])
            {
                $address = $results[0]->{'formatted_address'};
                if (!empty($classes)) $classes = ' ' . $classes;
                $result = '<div class="motopress-google-map-obj' . $classes . '">';
                $result .= '<iframe frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q='.$address.'&amp;t=m&amp;z='.$zoom.'&amp;output=embed&amp;iwloc=near"></iframe>';
                $result .= '</div>';
            }
        }
        return $result;
    }

    public function motopressEmbedCode($attrs, $content = null) {
        $embed = $data = $result = $fill_space = '';

        extract(shortcode_atts( array(
            'data' => '',
            'fill_space' => 'true',
            'classes' => ''
        ), $attrs) );
        $embed = base64_decode(strip_tags($data));
        $embed = preg_replace('~[\r\n]~', '', $embed);

        if (self::isContentEditor()) {
            $embed = '<div class="motopress-embed-obj-select"></div>' . $embed;
        }
        if (!empty($classes)) $classes = ' ' . $classes;
        $result .= '<div class="motopress-embed-obj' . (($fill_space == 'true' || $fill_space == '1') ?
            " fill-space" : "") . $classes . '">' . $embed . '</div>';
        return $result;
    }

    public function motopressQuotes($attrs, $content = null) {
        $result = '';
        $class = '';
        extract(shortcode_atts(array(
            'cite' => '',
            'cite_url' => '',
            'quote_content' => '',
            'classes' => ''
        ), $attrs));

        if (!empty($classes)) $classes = ' ' . $classes;
        if ($cite && $cite_url) {
            $result = '<div class="motopress-quotes' . $classes . '"><blockquote><p>'. $quote_content .'</p></blockquote><p style="text-align:right;"><a href="'.$cite_url.'">'.$cite.'</a></p></div>';
        }elseif ($cite) {
            $result = '<div class="motopress-quotes' . $classes . '"><blockquote><p>'. $quote_content .'</p></blockquote><p style="text-align:right;">'.$cite.'</p></div>';
        }else {
            $result = '<div class="motopress-quotes' . $classes . '"><blockquote><p>'. $quote_content .'</p></blockquote></div>';
        }

        return $result;
    }

    public function motopressMembersContent($attrs, $content = null) {
        $result = '';
        $text = '';
        extract(shortcode_atts(array(
            'message'    =>  '',
            'login_text' =>  '',
            'members_content' => '',
            'classes' => ''
        ), $attrs) );

        if ( !is_user_logged_in() ) {
            if (!$message) $message = 'This content is for registered users only. Please %login%.';
            if (!$login_text) $login_text = 'login';
            $text = '<a href="' . esc_attr(wp_login_url()) . '">' . $login_text . '</a>';
            if (!empty($classes)) $classes = ' ' . $classes;
            $result = '<div class="motopress-members-content' . $classes . '">' . str_replace( '%login%', $text, $message ) . '</div>';
        }else {
            $result = "<div class='motopress-members-content ". $classes ."'>". $members_content . "</div>";
        }

        return $result;
    }

    public function motopressSocialShare($attrs, $content = null) {
        $result = '';
        extract(shortcode_atts(array(
            'size' => '',
            'style' => '',
            'align' =>  '',
            'classes' => '',
        ), $attrs) );

        if (!$align) $align = 'motopress-text-align-left';
        if (!$size) $size = 'motopress-buttons-32x32';
        if (!$style) $style = 'motopress-buttons-square';
        if (!empty($classes)) $classes = ' ' . $classes;

        wp_enqueue_script( 'mp-social-share', plugins_url() . '/motopress-content-editor/includes/js/mp-social-share.js' , array( 'jquery' ), false, true);

        $result = '<div class="motopress-share-buttons ' . $align . ' ' . $size . ' ' . $style . $classes . '">';
        $result.= '<span class="motopress-button-facebook"><a href="#" title="Facebook" target="_blank"></a></span>';
        $result.= '<span class="motopress-button-twitter"><a href="#" title="Twitter" target="_blank"></a></span>';
        $result.= '<span class="motopress-button-google"><a href="#" title="Google +" target="_blank"></a></span>';
        $result.= '<span class="motopress-button-pinterest"><a href="#" title="Pinterest" target="_blank"></a></span>';
        $result.= '</div>';

        return $result;
    }

    public function motopressGoogleCharts($attrs, $content = null) {
        extract(shortcode_atts(array(
            'title' => '',
            
            'donut' => '',
            'classes' => '',
        ), $attrs) );

        $id = uniqid('motopress-google-chart-');

        if (!empty($classes)) $classes = ' ' . $classes;

        $js = "<script>jQuery(function(){
            var height = jQuery(document.getElementById('". $id ."')).parent().parent().height();
            if ( height < 100 ) { height = 200; }
            google.motopressDrawChart( '". $id ."',  height );
        });</script>";

        $chartTable = array();

        if ($content) {
            $content = trim($content);
            $content = preg_replace('/^<p>|<\/p>$/', '', $content);
            $content = preg_replace('/<br[^>]*>\s*\r*\n*/is', "\n", $content);
            $content = json_encode($content);
            $delimiter = ( strpos( $content, '\r\n') !== false) ? '\r\n' : '\n';
            $content = trim($content, '"');
            $content = str_replace('\"', '"', $content);
            $rows = explode( $delimiter, $content );
            $rowsCount = count($rows);

            if (version_compare(PHP_VERSION, '5.3.0', '>=')) {
                for ($i=0; $i < $rowsCount; $i++) {
                    $rows[$i] = str_getcsv($rows[$i]);
                    if ($i !== 0) {
                        $newArr = array();
                        for ($index=0; $index < count($rows[$i]); $index++) {
                            if ($index == 0) {
                                $newArr[] = $rows[$i][0];
                            } else {
                                $newArr[] = (integer) $rows[$i][$index];
                            }
                        }
                        $rows[$i] = $newArr;
                    }
                    $chartTable[] = $rows[$i];
                }
            } else {
                $tmpFile = new SplTempFileObject();
                $tmpFile->setFlags(SplFileObject::SKIP_EMPTY);
                $tmpFile->setFlags(SplFileObject::DROP_NEW_LINE);
                $resultedArray = $rowsConv = $itemsTypeConv = array();

                for ($i=0; $i < $rowsCount; $i++) {
                    $write = $tmpFile->fwrite( $rows[$i] . "\n" );
                    if (!is_null($write)) {
                        if ( $i == $rowsCount - 1 ) {
                            $tmpFile->rewind();
                            while (!$tmpFile->eof()) {
                                $row = $tmpFile->fgetcsv();
                                $isLast = $tmpFile->eof();
                                $resultedArray[] = $row;
                            }
                        }
                    }
                }

                foreach ($resultedArray as $array => $arrs) {
                    $arrsCounter = count($arrs);
                    for ($i = 0; $i < $arrsCounter; $i++) {
                        if ($array === 0) {
                            $rowsConv[0] = $arrs;
                        }
                        if ($array != 0 ) {
                            if ($i != 0) {
                                $itemsTypeConv[$i] = (int) $arrs[$i];
                            } else {
                                $itemsTypeConv[$i] = $arrs[$i];
                            }
                        }
                        if (!empty($itemsTypeConv) && $i == ($arrsCounter - 1)) {
                            $rowsConv[] = $itemsTypeConv;
                        }
                    }
                }
                $chartTable = $rowsConv;
            }

            $chartData = array(
                'ID' => $id,
                'type' => 'ColumnChart',
                'title' => $title,
                'donut' => $donut,
                'table' => $chartTable,
                'height' => null
            );

            $content = json_encode($chartData);
            $content = htmlspecialchars($content);

        } else {
            $content = null;
        }

        $result = "<div id=\"". $id ."\" class=\"motopress-google-chart" . $classes .
        "\" data-chart=\"". $content ."\"></div>";

        if (is_admin()) $result .= $js;

        return $result;
    }

    public function motopressWPAudio($attrs, $content = null) {
        global $motopressCESettings;
        require_once $motopressCESettings['plugin_root'] . '/' . $motopressCESettings['plugin_name'] . '/includes/getLanguageDict.php';
        require_once $motopressCESettings['plugin_root'] . '/' . $motopressCESettings['plugin_name'] . '/includes/Requirements.php';

        $motopressCELang = motopressCEGetLanguageDict();

        $result = '';
        $admin = '';
        $shortcode = '';
        $script = '';
        $mediaIsSet = '';
        $audioTitle = '';
        $src = '';
        extract(shortcode_atts(array(
         'source' => '',
         'id' => '',
         'url' => '',
         'autoplay' => '',
         'loop'     => '',
         'classes'  => '',
        ), $attrs) );

        $admin = is_admin();

        $blockID = uniqid('motopress-wp-audio-');

        if ( !empty($id) ) {
            $attachment = get_post( $id );
            $audioTitle = ' data-audio-title="'. $attachment->post_title .'"';
        }

        if ( $source == 'library' && !empty($id) ) {
            $audioURL = wp_get_attachment_url( $id );
            $mediaIsSet = true;
        } elseif ( $source == 'external' && !empty($url) ) {
            $audioURL = $url;
            $mediaIsSet = true;
        }

        if ( $mediaIsSet ) {
            $src = 'src="'. $audioURL .'"';
            if ( !isset($_GET['motopress-ce']) && !$admin ) {
                if ($autoplay == 'true' || $autoplay == 1) {
                    $autoplay = ' autoplay="on"';
                }else {
                    $autoplay = null;
                }
                if ($loop == 'true' || $loop == 1) {
                    $loop = ' loop="on"';
                }else {
                    $loop = null;
                }
            }
            $shortcode = "[audio '. $src . $autoplay . $loop .']";
        }else {
            $shortcode = "<p>". $motopressCELang->CCEwpAudioNoMediaSet ."</p>";
        }

        if (!empty($classes)) $classes = ' ' . $classes;

        $result = do_shortcode( '<div class="motopress-audio-object'. $classes. '" id="' . $blockID .'"' . $audioTitle .'>'. $shortcode . '</div>');

        $script = "<script>jQuery(function() { jQuery('#".$blockID."').find('.wp-audio-shortcode').mediaelementplayer(); }); </script>";

        if ( $admin && !empty($src) ) $result .= $script;

        return $result;
    }

    public function motopressTabs($attrs, $content = null) {
        extract(shortcode_atts(array(
            'active' => null,
            'padding' => 20,
            'classes' => ''
        ), $attrs));

        wp_enqueue_script('jquery-ui-tabs');

        if (!empty($classes)) $classes = ' ' . $classes;
        $uniqid = uniqid();
        $tabsHtml = '<div class="motopress-tabs-obj' . $classes . ' motopress-tabs-padding-'. $padding . '" id="' . $uniqid . '">';

        preg_match_all('/mp_tab id="([^\"]+)" title="([^\"]+)" active="(true|false)"/i', $content, $matches);

        if (!empty($matches[1]) && !empty($matches[2]) && !empty($matches[3])) {
            $tabsHtml .= '<ul>';
            $count = count($matches[1]);
            for ($i = 0; $i < $count; $i++) {
                $tabsHtml .= '<li><a href="#'. $matches[1][$i] . '">' . $matches[2][$i] . '</a></li>';
            }
            $tabsHtml .= '</ul>';

            $tabsHtml .= do_shortcode($content);

            if (!self::isContentEditor() || is_null($active)) {
                $active = array_search('true', $matches[3]);
            }

            $tabsHtml .= '<script type="text/javascript">
                jQuery(document).ready(function($) {
                    var mpTabs = $(".motopress-tabs-obj#' . $uniqid . '");
                    if (mpTabs.data("uiTabs")) {
                        mpTabs.tabs("destroy");
                    }
                    mpTabs.tabs({
                        active: ' . (int) $active . '
                    });
                });
                </script>';
        }
        $tabsHtml .= '</div>';

        return $tabsHtml;
    }

    public function motopressTab($attrs, $content = null) {
        extract(shortcode_atts(array(
            'id' => '',
            'title' => '',
            'active' => ''
        ), $attrs));
        return '<div class="motopress-tab" id="' . $id . '">' . do_shortcode($content) . '</div>';
    }

    public function motopressTable($attrs, $content = null) {
        extract(shortcode_atts(array(
            
            'classes' => ''
        ), $attrs));

        global $motopressCESettings;
        require_once $motopressCESettings['plugin_root'] . '/' . $motopressCESettings['plugin_name'] . '/includes/getLanguageDict.php';
        $motopressCELang = motopressCEGetLanguageDict();

        if (!empty($classes)) $classes = ' ' . $classes;
        

        $result = '<div class="motopress-table-obj' . $classes . '">';

        $content = trim($content);
        $content = preg_replace('/^<p>|<\/p>$/', '', $content);
        $content = preg_replace('/<br[^>]*>\s*\r*\n*/is', "\n", $content);

        if (!empty($content)) {
            $result .= '<table class="motopress-table'  . '">';
            $i = 0;
            if (version_compare(PHP_VERSION, '5.3.0', '>=')) {
                $rows = explode("\n", $content);
                $rowsCount = count($rows);
                foreach ($rows as $row) {
                    $row = str_getcsv($row);
                    $isLast = ($i === $rowsCount - 1) ? true : false;
                    self::addRow($row, $i, $isLast, $result);
                    $i++;
                }
            } else {
                $tmpFile = new SplTempFileObject();
                $tmpFile->setFlags(SplFileObject::SKIP_EMPTY);
                $tmpFile->setFlags(SplFileObject::DROP_NEW_LINE);
                $write = $tmpFile->fwrite($content);
                if (!is_null($write)) {
                    $tmpFile->rewind();
                    while (!$tmpFile->eof()) {
                        $row = $tmpFile->fgetcsv();
                        $isLast = $tmpFile->eof();
                        self::addRow($row, $i, $isLast, $result);
                        $i++;
                    }
                }
            }
            $result .= '</table>';
        } else {
            $result .= $motopressCELang->CETableObjNoData;
        }
        $result .= '</div>';
        return $result;
    }

    /**
     * @param array $row
     * @param int $i
     * @param boolean $isLast
     * @param string $result
     */
    private static function addRow($row, $i, $isLast, &$result) {
        if ($i === 0) {
            $result .= '<thead>';
            $result .= '<tr>';
            foreach ($row as $col) {
                $result .= '<th>' . trim($col) . '</th>';
            }
            $result .= '</tr>';
            $result .= '</thead>';
        } else {
            if ($i === 1) {
                $result .= '<tbody>';
            }
            if (($i - 1) % 2 !== 0) {
                $result .= '<tr class="odd-row">';
            } else {
                $result .= '<tr>';
            }
            foreach ($row as $col) {
                $result .= '<td>'. trim($col) .'</td>';
            }
            $result .= '</tr>';
            if ($isLast) {
                $result .= '</tbody>';
            }
        }
    }
}
